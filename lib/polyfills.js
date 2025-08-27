
// Node.js polyfills for browser globals
if (typeof globalThis.File === 'undefined') {
    globalThis.File = class File {
        constructor(chunks, filename, options = {}) {
            this.name = filename;
            this.type = options.type || '';
            this.lastModified = options.lastModified || Date.now();
            this.size = 0;
            
            if (chunks) {
                this.chunks = Array.isArray(chunks) ? chunks : [chunks];
                this.size = this.chunks.reduce((size, chunk) => {
                    if (typeof chunk === 'string') return size + Buffer.byteLength(chunk);
                    if (Buffer.isBuffer(chunk)) return size + chunk.length;
                    return size;
                }, 0);
            } else {
                this.chunks = [];
            }
        }
        
        stream() {
            // Basic implementation
            return {
                getReader() {
                    let index = 0;
                    return {
                        read() {
                            if (index >= this.chunks.length) {
                                return Promise.resolve({ done: true });
                            }
                            return Promise.resolve({
                                done: false,
                                value: this.chunks[index++]
                            });
                        }
                    };
                }
            };
        }
        
        arrayBuffer() {
            return Promise.resolve(Buffer.concat(this.chunks.map(chunk => 
                Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
            )));
        }
        
        text() {
            return Promise.resolve(Buffer.concat(this.chunks.map(chunk => 
                Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
            )).toString());
        }
    };
}

module.exports = {};
