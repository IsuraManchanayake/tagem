import { global } from '../../global/global'
import { exec } from 'child_process'
import path from 'path'

export class File {
    /**
     * Creates File object
     * @param {string} path 
     * @param {Tag} tags 
     */
    constructor(path, tags) {
        this.path = path || null

        this.name = ""
        if (this.path !== null) {
            var pathSplit = this.path.split("/")
            if (pathSplit.length > 0) {
                this.name = pathSplit[pathSplit.length - 1]
            }
        }

        this.tags = tags || []
        this.thumbnail = this.getThumbnail()
    }

    /**
     * Appends a tag to a file. Ignores if the tag is already present.
     * @param {Tag} tag 
     */
    addTag(tag) {
        for (var i = 0; i < this.tags.length; i++) {
            tg = this.tags[i]
            if (tg.name == tag.name && tg.category == tag.category) {
                return;
            }
        }
        this.tags.push(tag)
    }

    /**
     * Appends a list of tags to the tag list.
     * 
     * @param {Tag[]} tags 
     */
    appendTags(tags) {
        tags.forEach(function(tag) {
            this.addTag(tag)
        })
    }

    /**
     * Sets tag list
     * 
     * @param {Tag[]} tags 
     */
    setTags(tags) {
        this.tags = tags
    }

    /**
     * Sets thumbnail of the object according to the file extension type
     */
    getThumbnail() {
        try {
            var imgExtensions = ["jpg", "JPG", "jpeg", "png", "gif"];
            var fontExtensions = ["ttf", "ttc", "otf"];
            var audioExtensions = ["mp3"];
            var fileSplit = this.name.split(".");
            if (fileSplit.length > 0) {
                var ext = fileSplit[fileSplit.length - 1]
                if (imgExtensions.indexOf(ext) >= 0) {
                    return this.path;
                }
                if (audioExtensions.indexOf(ext) >= 0) {
                    return global.defaultMP3Thumb;
                }
                this.isFont = (fontExtensions.indexOf(ext) >= 0);
            }
        } catch (err) {
            return global.defaultFileThumb;
        }
        return global.defaultFileThumb;
    }

    getImgSrcUrl() {
        try {
            var imgExtensions = ["jpg", "JPG", "jpeg", "png", "gif"];
            var fontExtensions = ["ttf", "ttc", "otf"];
            var audioExtensions = ["mp3"];
            var fileSplit = this.name.split(".");
            if (fileSplit.length > 0) {
                var ext = fileSplit[fileSplit.length - 1]
                if (imgExtensions.indexOf(ext) >= 0) {
                    return this.path;
                }
                if (audioExtensions.indexOf(ext) >= 0) {
                    var audioThumbnail;
                    mm(fs.createReadStream('/media/isura/2030CA7330CA5008/demo/songs/01-bruno_mars-24k_magic.mp3'), function(err, metadata) {
                        if (err) throw err;
                        audioThumbnail = 'data:image/jpg;base64,' + metadata.picture[0].data.toString('base64');
                        // console.log(metadata.picture[0].data.toString('base64'));
                    });
                    return audioThumbnail;
                    // return global.defaultMP3Thumb;
                }
                this.isFont = (fontExtensions.indexOf(ext) >= 0);
            }
        } catch (err) {
            return global.defaultFileThumb;
        }
        return global.defaultFileThumb;
    }

    /**
     * open file using xdg-open: linux
     */
    open() {
        var command = 'xdg-open ' + path.resolve(this.path)
            .replace(/ /g, '\\ ')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\(/g, '\\(')
            .replace(/\)/g, '\\)');
        console.log(command);
        exec(command);
    }
}