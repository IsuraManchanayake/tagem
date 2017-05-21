import { global } from '../../global/global'
import * as filequery from '../../data/filequery'
import { File } from './file'
import { Tag } from './tag'
import { Category } from './category'
import asyncLoop from 'node-async-loop'

export class Folder {
    /**
     * creates Folder objects
     * 
     * @param {string} path 
     * @param {File[]} files 
     */
    constructor(path, files) {
        this.path = path || null
        this.files = files || []

        this.name = ""
        if (this.path !== null) {
            var pathSplit = this.path.split("/")
            if (pathSplit.length > 0) {
                this.name = pathSplit[pathSplit.length - 2]
            }
        }

        this.thumbnail = global.defaultFolderThumb
    }

    /**
     * set files attribute
     * 
     * @param {File[]} files 
     */
    setFiles(files) {
        this.files = files
    }

    /**
     * Add a file to file list. If the file already exists, new tags of the
     * file are appended 
     * 
     * @param {File} file 
     */
    addFile(file) {
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name == file.name) {
                this.files[i].setTags(file.tags)
            }
        }
        this.files.push(file)
    }

    /**
     * Add a set of files to the file list. If a file already
     * exists, the file is handled as in addFile(file) method
     * 
     * @param {File[]} files 
     */
    appendFiles(files) {
        files.forEach(function(file) {
            this.addFile(file)
        })
    }

    /**
     * Appends tag to a file and added to the files list. If the file 
     * already exists, the tags are appended
     * 
     * @param {File} file 
     * @param {Tag} tag 
     */
    appendTag(file, tag) {
        for (var i = 0; i < this.files.length; i++) {
            if (this.files[i].name == file.name) {
                this.files[i].addTag(tag)
                return;
            }
        }
        file.addTag(tag)
        this.files.push(file)
    }

    /**
     * list all files in the folder
     * @param {Function} callback
     */
    listAllFiles(callback) {
        var self = this;
        filequery.listAllFilesInsideFolder(this.folid, function(err, rows) {
            if (err) {
                console.log(err);
            } else {
                asyncLoop(rows, function(row, next) {
                    var filid = row.filid;
                    console.log(filid);
                    if (filid in self.files) {} else {
                        self.files[filid] = new File(self.path + row.filename);
                    }
                    if (row.tid) {
                        self.files[filid].tags.push(new Tag(row.tname, new Category(row.cname, row.color), row.tid));
                    }
                    next();
                }, function() {
                    callback();
                })
            }
        })
    }


}

/**
 * list all indexed folders in the database
 * @param {Function} callback(folder)
 */
export const listAllFolders = (callback) => {
    filequery.listAllIndexedFolders(function(err, rows) {
        if (err) {
            console.error(err);
        } else {
            rows.forEach(function(row) {
                var folder = new Folder(row.fpath);
                folder.folid = row.folid;
                callback(folder);
            });
        }
    });
}