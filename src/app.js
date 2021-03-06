import './helpers/context_menu.js';
import './helpers/external_links.js';

import { remote } from 'electron';
import path from 'path'
import fs from 'fs'
import jetpack from 'fs-jetpack';
import env from './env';
import { exec } from 'child_process'
// import path from 'path';
import interact from 'interact.js'
import { ProvidePlugin } from 'webpack'
import asyncLoop from 'node-async-loop'

var a = new ProvidePlugin({
    $: "jquery",
    jQuery: "jquery",
    "window.jQuery": "jquery"
});
import 'jquery-ui-bundle'

// import { listAllFiles } from './tagpress/model/tagpressfilehandler/validator'
import { Folder } from './tagpress/model/fileinformation/folder'
import { File } from './tagpress/model/fileinformation/file'
import { Tag } from './tagpress/model/fileinformation/tag'
import { Category } from './tagpress/model/fileinformation/category'
import { Searcher } from './tagpress/model/search/searcher'
import { FileGrouper } from './tagpress/model/corefunctionhandler/filegrouper'
import { global } from './tagpress/global/global'
import * as filequery from './tagpress/data/filequery'
import * as hf from './tagpress/view/js/htmlfactory'
import * as t from './tagpress/model/corefunctionhandler/thumbnail';

// var lista = listAllFiles(new Folder('src/tagpress/test/example/'))

const { dialog } = require('electron').remote

// BrowserWindow.getFocusedWindow().toggleDevTools();

const app = remote.app;
const appDir = jetpack.cwd(app.getAppPath());

const manifest = appDir.read('package.json', 'json');

const osMap = {
    win32: 'Windows',
    darwin: 'macOS',
    linux: 'Linux',
};

var currentFolder;
var targetFolderPath = '/home/isura';

var allFolder = { path: "", name: ".." };
var div = document.createElement('div');
div.innerHTML = hf.getFileNavigationFolderHTML(allFolder);
div.addEventListener('click', function() {
    currentFolder = null;
    // showAllFiles();
    document.querySelector('#file-preview').setAttribute('data-current-folder', '');
    document.querySelector('#file-preview').innerHTML = '';
});
document.querySelector("#file-nav").appendChild(div);

filequery.listAllIndexedFolders(function(err, rows) {
    if (err) {
        console.error(err);
    } else {
        rows.forEach(function(row) {
            var folder = new Folder(row.fpath);
            folder.folid = row.folid;
            var div = document.createElement('div');
            div.innerHTML = hf.getFileNavigationFolderHTML(folder);
            div.addEventListener('click', function() {
                currentFolder = folder;
                showFiles(folder);
                document.querySelector('#file-preview').setAttribute('data-current-folder', folder.folid);
            });
            document.querySelector("#file-nav").appendChild(div);
        });
    }
});

var showAllFiles = function() {

}

var onRemoveTagFromAFile = function(filid, tname, cname, callback) {
    filequery.removeTagFromFile(filid, tname, cname, callback);
}

var selectedFiles = [];

var showFiles = function(folder) {
    // console.log(folder);
    var ul = document.createElement('ul');
    filequery.getAllTagsInTheFolder(folder.folid, function(tagMap) {
        filequery.getIndexedFilesInsideFolder(folder.folid, function(err, rows) {
            if (err) {
                console.error(err);
            } else {
                document.querySelector("#file-preview").innerHTML = '';
                // var dbconnect = new DBConnect();
                var ol = document.createElement('ol');
                ol.id = 'selectable';
                rows.forEach(function(row) {
                    var file = new File(folder.path + row.filename);
                    file.fid = row.filid;
                    // var div = document.createElement('div');
                    var li = document.createElement('li');
                    if (file.isFont) {
                        var fontFace = document.createElement('style');
                        fontFace.appendChild(document.createTextNode(hf.getNewFontFaceHTML(file)));
                        document.head.appendChild(fontFace);
                        // div.innerHTML = hf.getFontThumbnailPreview(file);
                        li.innerHTML = hf.getFontThumbnailPreview(file);
                    } else {
                        // div.innerHTML = hf.getImageThumbnailPreview(file);
                        li.innerHTML = hf.getImageThumbnailPreview(file);
                        t.getThumbnailImgSrc(file, function(tt) {
                            console.log('folder preview');
                            console.log(file);
                            li.querySelector('img').src = tt;
                        });
                    }
                    li.querySelector('.open-file').addEventListener('click', function() {
                        file.open();
                    });
                    // div.className = 'ui-state-default';
                    li.className = 'ui-state-default';
                    ol.appendChild(li);
                    // document.querySelector("#file-preview").appendChild(div);
                });
                document.querySelector("#file-preview").appendChild(ol);
                var files = [];
                tagMap.forEach(function(tag) {
                    if (tag.filid in files) {} else {
                        files[tag.filid] = {};
                        files[tag.filid].tags = [];
                    }
                    files[tag.filid].tags.push(new Tag(tag.tname, new Category(tag.cname, tag.color)));
                });
                // console.log(files);
                hf.showTags(files, onRemoveTagFromAFile);
                $('#selectable').selectable({
                    filter: '.gallery',
                    selected: function() {
                        selectedFiles = [];
                        $('.ui-selected', this).each(function() {
                            selectedFiles.push(this.getAttribute('data-filid'));
                        });
                        console.log(selectedFiles);
                    }
                });
            }
        });
    });
}

var onNewTagEnterKey = function(inputText, categoryName, categoryColor) {
    filequery.insertNewTag(categoryName, inputText, function(err) {
        if (err && err.message.startsWith('ER_DUP_ENTRY')) {
            alert('No duplicate tag names');
        } else {
            hf.showNewTag(categoryName, inputText, categoryColor, onEditTag, onRemoveTag);
        }
    });
}

var onAddNewTag = function(category) {
    console.log('sdfsdf');
    console.log(category);
    hf.showInputNewTag(category).addEventListener('keydown', function(e) {
        if (e.keyCode == 13) { // Enter key
            onNewTagEnterKey(this.value, category.name, category.color);
            this.remove();
            hf.showAddNewTagIcon(category).addEventListener('click', function() {
                onAddNewTag(category);
            });
        } else if (e.keyCode == 27) { // Escape key
            this.remove();
            hf.showAddNewTagIcon(category).addEventListener('click', function() {
                onAddNewTag(category);
            });
        } else if (e.keyCode == 32) { // Space key
            e.preventDefault();
        }
    });
}

var onCreateNewCategory = function(categoryName, categoryColor) {
    // alert(categoryName + ' - ' + categoryColor);
    filequery.insertCategory(categoryName, categoryColor, function(err) {
        if (err && err.message.startsWith('ER_DUP_ENTRY')) {
            alert('no duplicate categories');
        } else {
            hf.showNewCategory(categoryName, categoryColor, onAddNewTag);
        }
    });
}

var onAddNewCategoryBtnClicked = function() {
    hf.showInputNewCategory(onCreateNewCategory);
}

var onRemoveTag = function(category, tag) {
        filequery.checkTagAvailabilityBeforeRemoveTag(category, tag, function(err, avail) {
            if (!err) {
                if (avail) {
                    var ans = confirm('The tag: ' + tag + '(' + category + ') has been tagged by some of ' +
                        'files. Do you want to remove the tag? (The tag of those files will be automatically removed)');
                    if (ans) {
                        filequery.removeTag(category, tag, function(err) {
                            document.querySelector('#tagkbd-' + category + '-' + tag).remove();
                            showFiles(currentFolder);
                        });
                    }
                } else {
                    var ans = confirm('The tag: ' + tag + '(' + category + ') is not tagged by any of ' +
                        'files. Do you want to remove the tag?');
                    if (ans) {
                        filequery.removeTag(category, tag, function(err) {
                            document.querySelector('#tagkbd-' + category + '-' + tag).remove();
                        });
                    }
                }
            }
        });
    }
    // filequery.removeTag(category, tag, function(err) {
    //     if (!err) {
    //         document.querySelector('#tagkbd-' + category + '-' + tag).remove();
    //     };
    // });

var onEditTag = function(category, tag) {
    alert('edit ' + category + ' - ' + tag);
}

filequery.getAllTags(function(tagrows) {
    var tags = [];
    tagrows.forEach(function(tagrow) {
        if (tagrow.cname in tags) {} else {
            tags[tagrow.cname] = {};
            tags[tagrow.cname].tags = [];
        }
        var tag = new Tag(tagrow.tname, new Category(tagrow.cname, tagrow.color));
        tag.tid = tagrow.tid;
        tags[tagrow.cname].tags.push(tag);
    });
    var emptyCategories = [];
    filequery.getEmptyCategories(function(emptyCategoryRows) {
        if (emptyCategoryRows) {
            emptyCategoryRows.forEach(function(categoryrow) {
                emptyCategories.push(new Category(categoryrow.cname, categoryrow.color));
            });
        }
        hf.showTagInventory(tags, emptyCategories, onAddNewTag, onRemoveTag, onEditTag, onAddNewCategoryBtnClicked);
    });
});

document.querySelector('#tag-inventory').style.overflowY = "scroll";

var onTag = function(filid, cname, tname, successCallback, errCallback, doAtEnd) {
    if (selectedFiles.length == 0) {
        filequery.tagFile(filid, cname, tname, successCallback, errCallback);
        doAtEnd();
    } else {
        asyncLoop(selectedFiles, function(_filid, next) {
            filequery.tagFile(_filid, cname, tname, successCallback, errCallback);
            next();
        }, function() {
            selectedFiles = [];
            doAtEnd();
        });
    }
}

hf.makeInventoryTagsDraggable(onTag, onRemoveTagFromAFile);

document.querySelector('#btn-group-files').addEventListener('click', function() {
    document.querySelector('#browse-path').value = targetFolderPath;
    var tagcheck = document.querySelector('#choose-tag');
    tagcheck.innerHTML = '';
    filequery.getAllTags(function(rows) {
        rows.forEach(function(row) {
            var tag = new Tag(row.tname, new Category(row.cname, row.color), row.tid);
            var input = document.createElement('input');
            // console.log(tag);
            input.type = 'checkbox';
            input.id = 'check-' + tag.tid;
            input.className = 'option-tag-check'
            input.setAttribute('data-tag-name', tag.name);
            input.setAttribute('data-tag-tid', tag.tid);
            input.setAttribute('data-tag-cname', tag.category.name);
            input.setAttribute('data-tag-color', tag.category.color);
            input.name = 'options';
            var label = document.createElement('label');
            label.addEventListener('click', function() {
                if (!input.checked) {
                    console.log('checked');
                    label.classList.add('checked-tag');
                } else {
                    console.log('un-checked');
                    label.classList.remove('checked-tag');
                }
            });
            label.htmlFor = 'check-' + tag.tid;
            label.className = 'btn btn-default btn-tag-check';
            label.innerHTML += tag.name;
            label.appendChild(input);
            label.style.backgroundColor = tag.category.color;
            tagcheck.appendChild(label);
        });
    });
});

document.querySelector('#browse-target').addEventListener('click', function() {
    dialog.showOpenDialog({
        title: 'choose a folder to group files',
        defaultPath: '/home/',
        properties: ['openDirectory'],
    }, function(folderPath) {
        targetFolderPath = folderPath;
        document.querySelector('#browse-path').value = targetFolderPath;
    });
});

var listCurrentFiles = function() {
    // if(b)
    var files = [];
    document.querySelectorAll('.gallery').forEach(function(thumbnail) {
        var filepath = thumbnail.getAttribute('data-filepath');
        var filid = thumbnail.getAttribute('data-filid');
        var tags = [];
        thumbnail.querySelectorAll('kbd').forEach(function(kbd) {
            var tag = new Tag(kbd.getAttribute('data-tname'), new Category(kbd.getAttribute('data-cname')));
            tags.push(tag);
        });
        var file = new File(thumbnail.getAttribute('data-filepath'), tags, thumbnail.getAttribute('data-filid'));
        // console.log(file);
    });
    return files;
}

document.querySelector('#btn-group-now').addEventListener('click', function() {
    var target = document.querySelector('#browse-path').value;
    var tags = [];
    var files = [];
    if (target) {
        asyncLoop([...document.querySelectorAll('.gallery')], function(thumbnail, next) {
            if (thumbnail) {
                var filepath = thumbnail.getAttribute('data-filepath');
                var filid = thumbnail.getAttribute('data-filid');
                var filetags = [];
                if (thumbnail.querySelectorAll('kbd')) {
                    asyncLoop([...thumbnail.querySelectorAll('kbd')], function(kbd, next2) {
                        if (kbd) {
                            console.log(kbd);
                            var tag = new Tag(kbd.getAttribute('data-tname'), new Category(kbd.getAttribute('data-cname')));
                            filetags.push(tag);
                        }
                        next2();
                    });
                }
                var file = new File(thumbnail.getAttribute('data-filepath'), filetags, thumbnail.getAttribute('data-filid'));
                files.push(file);
            }
            next();
        }, function() {
            asyncLoop([...document.querySelectorAll('.option-tag-check')], function(input, next3) {
                if (input) {
                    if (input.checked) {
                        tags.push(new Tag(input.getAttribute('data-tag-name'), new Category(input.getAttribute('data-tag-cname'))));
                    }
                }
                next3();
            }, function() {
                var fg = new FileGrouper(files, tags, target + '/');
                fg.copyFiles();
                // console.log(files);
                // console.log(tags);
            });
        });

    } else {
        alert('Fill required fields');
    }
});


var importFolder = function(folpath, callback) {
    filequery.importFolder(folpath, function(_err, folid) {
        // console.log('0' + folid);
        if (_err && _err.message.startsWith('ER_DUP_ENTRY')) {
            alert('No duplicate folders');
        } else {
            fs.readdir(folpath, function(err, files) {
                // console.log('1' + folid);
                if (err) {
                    throw err;
                }
                files.map(function(file) {
                    // console.log('2' + folid);
                    return path.join(folpath, file);
                }).filter(function(file) {
                    // console.log('3' + folid);
                    return fs.statSync(file).isFile();
                }).forEach(function(file) {
                    // console.log('4' + folid);
                    filequery.importFile(folid, path.basename(file), function(folid) {});
                    // console.log("%s (%s)", file, path.extname(file));
                    // callback(folid, )
                });
                var folder = new Folder(folpath + "/");
                folder.folid = folid;
                currentFolder = folder;
                callback(folder)
            });
        }
    });
}

document.querySelector('#btn-import').addEventListener('click', function() {
    dialog.showOpenDialog({
        title: 'choose a file to import a folder',
        defaultPath: '/home/',
        properties: ['openFile', 'multiSelections'],
    }, function(filePaths) {
        var folpath = path.dirname(filePaths[0]);
        importFolder(folpath, function(folder) {
            hf.showNewFolder(folder, showFiles);
        });
    });
});

var onSearch = function(callback) {
    var keywords = document.querySelector('#input-search').value;
    var folderid = document.querySelector('#file-preview').getAttribute('data-current-folder');
    if (keywords) {
        var search = new Searcher(keywords, folderid);
        search.search(callback);
    } else {
        if (currentFolder) {
            showFiles(currentFolder);
        } else {
            document.querySelector('#file-preview').innerHTML = '';
        }
    }
}

var onSearchBtnClicked = function() {
    onSearch(function(files) {
        document.querySelector("#file-preview").innerHTML = '';
        var ol = document.createElement('ol');
        ol.id = 'selectable';
        // console.log(files);
        // console.log(Object.keys(files));
        console.log(files);
        if (!!Object.keys(files).length) {
            for (var filid in files) {
                if (files.hasOwnProperty(filid)) {
                    var file = files[filid];
                    file.fid = filid;
                    var li = document.createElement('li');
                    console.log('search ' + filid);
                    // console.log(tt.length);
                    if (file.isFont) {
                        var fontFace = document.createElement('style');
                        fontFace.appendChild(document.createTextNode(hf.getNewFontFaceHTML(file)));
                        document.head.appendChild(fontFace);
                        // div.innerHTML = hf.getFontThumbnailPreview(file);
                        li.innerHTML = hf.getFontThumbnailPreview(file);
                    } else {
                        // div.innerHTML = hf.getImageThumbnailPreview(file);
                        li.innerHTML = hf.getImageThumbnailPreview(file);
                        t.getThumbnailImgSrc(file, function(tt) {
                            console.log('search files');
                            console.log(file);
                            li.querySelector('img').src = tt;
                        });
                    }
                    console.log('src ' + filid);
                }
                li.querySelector('.open-file').addEventListener('click', function() {
                    file.open();
                });
                // div.className = 'ui-state-default';
                li.className = 'ui-state-default';
                ol.appendChild(li);
            }
            document.querySelector("#file-preview").appendChild(ol);
            hf.showTags(files, onRemoveTagFromAFile);
            $('#selectable').selectable({
                filter: '.gallery',
                selected: function() {
                    selectedFiles = [];
                    $('.ui-selected', this).each(function() {
                        selectedFiles.push(this.getAttribute('data-filid'));
                    });
                    console.log(selectedFiles);
                }
            });
        } else {
            document.querySelector('#file-preview').innerHTML = '<div id="no-results"><h2>No results for "' + document.querySelector('#input-search').value + '"</h2></p>';
        }
    });
}

document.querySelector('#btn-search').addEventListener('click', function() {
    onSearchBtnClicked();
});

document.querySelector("#input-search").addEventListener('keydown', function(e) {
    if (e.keyCode == 13) { // Enter key
        onSearchBtnClicked();
    }
});


// var sqlite3 = require('sqlite3').verbose();
// console.log(__dirname + "sdfsd");
// var db = new sqlite3.Database(path.resolve(__dirname, '../db/test.db'));
// var check;
// db.serialize(function() {
//     db.each('select filetag.filid, filetag.tid, tag.tname, category.cname, category.color ' +
//         'from filetag, tag, category where filetag.filid=' + 4002 + ' and filetag.tid=tag.tid' +
//         ' and category.cid=tag.cid',
//         function(err, row) {
//             console.log('sqlite3 ' + row.filid + ' ' + row.tid + ' ' + row.tname + ' ' + row.cname + ' ' + row.color);
//             // console.log(row.id + ": " + row.info);
//         });
// });

// db.close();

// var file1 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI01S_xbox.mp4', [
//     new Tag('abc', new Category('def', 'ghi'), "1"),
//     new Tag('jkl', new Category('mno', 'pqr'), "2")
// ]);
// var file2 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI02S_xbox.mp4', [
//     new Tag('abc', new Category('def', 'ghi'), "1"),
//     new Tag('321', new Category('mno', 'pqr'), "3")
// ]);
// var file3 = new File('/media/isura/2030CA7330CA5008/shiki/SHIKI01S_xbox.mp4', [
//     new Tag('abc', new Category('def', 'ghi'), "1"),
//     new Tag('jkl', new Category('mno', 'pqr'), "2"),
//     new Tag('321', new Category('mno', 'pqr'), "3")
// ]);
// var files = [file1, file2, file3];
// var tags = [new Tag('abc', new Category('def', 'ghi'), "1"), new Tag('jkl', new Category('mno', 'pqr'), "2")];
// var fg = new FileGrouper(files, tags, '/media/isura/2030CA7330CA5008/shiki/da/');
// fg.copyFiles();

import mm from 'musicmetadata';

var parser = mm(fs.createReadStream('/media/isura/2030CA7330CA5008/demo/songs/01-bruno_mars-24k_magic.mp3'), function(err, metadata) {
    if (err) throw err;
    // console.log(metadata.picture[0].data.toString('base64'));
});