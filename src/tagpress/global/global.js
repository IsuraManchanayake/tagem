export const global = {
    // defaultFileThumb: "src/tagpress/view/img/default-file-thumb.png",
    defaultFileThumb: "/media/isura/2030CA7330CA5008/project/tagpress2/app/img/default-file-thumb.png",
    defaultMP3Thumb: "/media/isura/2030CA7330CA5008/project/tagpress2/app/img/default-mp3-thumb.png",
    defaultFolderThumb: "src/tagpress/view/img/default-folder-thumb.png",
    tagpressFileName: ".tagpress",
    tagpressspaces: 1,
    dbuser: 'root',
    dbhost: '127.0.0.1',
    dbport: '3306',
    dbpassword: '',
    dbname: 'tagpress',
    defaultFontPreviewLine: 'AaBbCc',
    tagMaxLength: 20,
    CSSColors: ['lightpink', 'pink', 'crimson', 'lavenderblush', 'palevioletred', 'hotpink', 'deeppink', 'mediumvioletred', 'orchid', 'thistle', 'plum', 'violet', 'magenta', 'fuchsia', 'darkmagenta', 'purple', 'mediumorchid', 'darkviolet', 'darkorchid', 'indigo', 'blueviolet', 'mediumpurple', 'mediumslateblue', 'slateblue', 'darkslateblue', 'lavender', 'ghostwhite', 'blue', 'mediumblue', 'midnightblue', 'darkblue', 'navy', 'royalblue', 'cornflowerblue', 'lightsteelblue', 'lightslategray', 'slategray', 'dodgerblue', 'aliceblue', 'steelblue', 'lightskyblue', 'skyblue', 'deepskyblue', 'lightblue', 'powderblue', 'cadetblue', 'azure', 'lightcyan', 'paleturquoise', 'cyan', 'aqua', 'darkturquoise', 'darkslategray', 'darkcyan', 'teal', 'mediumturquoise', 'lightseagreen', 'turquoise', 'aquamarine', 'mediumaquamarine', 'mediumspringgreen', 'mintcream', 'springgreen', 'mediumseagreen', 'seagreen', 'honeydew', 'lightgreen', 'palegreen', 'darkseagreen', 'limegreen', 'lime', 'forestgreen', 'green', 'darkgreen', 'chartreuse', 'lawngreen', 'greenyellow', 'darkolivegreen', 'yellowgreen', 'olivedrab', 'beige', 'lightgoldenrodyellow', 'ivory', 'lightyellow', 'yellow', 'olive', 'darkkhaki', 'lemonchiffon', 'palegoldenrod', 'khaki', 'gold', 'cornsilk', 'goldenrod', 'darkgoldenrod', 'floralwhite', 'oldlace', 'wheat', 'moccasin', 'orange', 'papayawhip', 'blanchedalmond', 'navajowhite', 'antiquewhite', 'tan', 'burlywood', 'bisque', 'darkorange', 'linen', 'peru', 'peachpuff', 'sandybrown', 'chocolate', 'saddlebrown', 'seashell', 'sienna', 'lightsalmon', 'coral', 'orangered', 'darksalmon', 'tomato', 'mistyrose', 'salmon', 'snow', 'lightcoral', 'rosybrown', 'indianred', 'red', 'brown', 'firebrick', 'darkred', 'maroon', 'white', 'whitesmoke', 'gainsboro', 'lightgray', 'silver', 'darkgray', 'gray', 'dimgray', 'black'],
    lightCSSColors: ['white', 'lightgrey', 'whitesmoke', 'floralwhite', 'ivory', 'lightyellow', 'lemonchiffon', 'mintcream', 'honeydew', 'azure', 'lightcyan', 'ghostwhite', 'aliceblue', 'lavenderblush', 'lavender', 'beige', 'lightgoldenrodyellow', 'cornsilk', 'oldlace', 'seashell', 'snow', 'linen', 'papayawhip', 'blanchedalmond', 'antiquewhite', 'mistyrose', 'gainsboro', 'thistle', 'paleturquoise', 'powderblue', 'aquamarine', 'palegreen', 'yellow', 'greenyellow', 'palegoldenrod', 'khaki', 'wheat', 'moccasin', 'navajowhite', 'bisque', 'peachpuff', 'lightgray', 'cyan', 'aqua'],
    dragMoveListener: function(event) {
        var target = event.target,
            x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
            y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.webkitTransform =
            target.style.transform =
            'translate(' + x + 'px, ' + y + 'px)';
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
    },
    sqlite3dbpath: './db/tagpress.db'
}