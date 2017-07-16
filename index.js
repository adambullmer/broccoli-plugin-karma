const Plugin = require('broccoli-plugin'),
    karma = require('karma'),
    fs = require('fs'),
    path = require('path'),
    rimraf = require('rimraf'),
    quickTemp = require('quick-temp'),
    symlinkOrCopySync = require('symlink-or-copy').sync;

module.exports = BroccoliKarma;
BroccoliKarma.prototype = Object.create(Plugin.prototype);
BroccoliKarma.prototype.constructor = BroccoliKarma;

function BroccoliKarma (inputNode, options, karmaConfig) {
    if (!(this instanceof BroccoliKarma)) {
        return new BroccoliKarma(inputNode, options);
    }

    options = options || {};
    Plugin.call(this, [inputNode] , {
        persistentOutput: true,
        needsCache: false,
        annotation: options.annotation,
    });

    this.options = options;
    this.config = karmaConfig;
    quickTemp.makeOrRemake(this, 'karmaDir');
    this.options.basePath = this.karmaDir;
}

function copyDirContent (srcDir, destDir) {
    const items = fs.readdirSync(srcDir);

    for (let i = 0, len = items.length; i < len; i++) {
        const item = items[i],
            src = path.join(srcDir, item),
            dest = path.join(destDir, item);

        symlinkOrCopySync(src, dest);
    }
}

BroccoliKarma.prototype.build = function () {
    rimraf.sync(`${this.karmaDir}/*`);
    copyDirContent(this.inputPaths[0], this.karmaDir);

    return this.runKarma(this.options);
};

BroccoliKarma.prototype.runKarma = function (options) {
    const deferred = new Promise((resolve, reject) => {
        // Start server and wait until it exits.
        // When tests fail, build will fail too.
        if (options.singleRun) {
            const server = new karma.Server(options, (exitCode) => {
                if (exitCode !== 0) {
                    reject(new Error('Karma exited with error'));
                } else {
                    resolve();
                }
            });

            server.start();

        } else {
            // Start server once and do not block - usable with 'broccoli serve'
            if (!this.server) {
                const server = new karma.Server(options, resolve);

                server.start();
                this.server = server;
            } else {
                console.log('Refreshing Karma');
                this.server.refreshFiles();
            }
            resolve();
        }
    });

    return deferred;
}
