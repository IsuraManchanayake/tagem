import path from 'path';
import mm from 'musicmetadata';
import { global } from '../../global/global'
import fs from 'fs';

export const getThumbnailImgSrc = (file, callback) => {
    try {
        var imgExtensions = ["jpg", "JPG", "jpeg", "png", "gif"];
        var fontExtensions = ["ttf", "ttc", "otf"];
        var audioExtensions = ["mp3"];
        var fileSplit = file.name.split(".");
        if (fileSplit.length > 0) {
            var ext = fileSplit[fileSplit.length - 1]
            if (imgExtensions.indexOf(ext) >= 0) {
                return callback('file://' + path.resolve(file.path));
            }
            if (audioExtensions.indexOf(ext) >= 0) {
                var audioThumbnail = 'file://' + path.resolve(global.defaultMP3Thumb);
                // console.log('dfs');
                mm(fs.createReadStream(path.resolve(file.path)), function(err, metadata) {
                    // console.log(metadata);
                    if (err) {
                        console.log(err);
                        throw err;
                    }
                    if (metadata.picture[0]) {
                        audioThumbnail = 'data:image/jpg;base64,' + metadata.picture[0].data.toString('base64');
                    }
                    // return callback()
                    // console.log(audioThumbnail);
                    return callback(audioThumbnail);
                });
                // return callback(audioThumbnail);
                // return global.defaultMP3Thumb;
            }
            file.isFont = (fontExtensions.indexOf(ext) >= 0);
        }
    } catch (err) {
        return callback('file://' + path.resolve(global.defaultFileThumb));
    }
    return callback('file://' + path.resolve(global.defaultFileThumb));
}