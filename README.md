# Tagem

> _Tag'em all_

A file organizing system based on tags using electron.

## Task List

Done in 1.1.0

- [x] Import folder
- [x] Preview files in a folder (different thumbnail types for images, fonts, music, other files)
- [x] Tag files
- [x] Select several files and **_tag them all_**
- [x] Tag drag drop
- [x] Remove tag from a file
- [x] Remove tag from inventory
- [x] Add new category (by specifying a name and color)
- [x] Adding a new tag (by specifying a name)
- [x] Search files
  - [x] by tag name or,
  - [x] by file name or,
  - [x] several tag/file names comma and/or space seperated
  - [x] in a specified folder or,
  - [x] globally (in all imported folders)
- [x] Group files
  - [x] Copy files to folders by specifying target and tags
  - [x] in a specified folder or,
  - [x] from the search results

Task list for 2.0.0
- [ ] Fix architectural issues
- [ ] Fix tag drag and drop from scrolled #tag-inventory div bug
- [ ] Fix the inability to remove the tag after batch tagging bug
- [ ] Add recursive folder import
- [ ] Add folder search
- [ ] Fix search by name bug (only tagged files are searched for name)
- [ ] Add less resolution image thumbnail preview
- [x] Add album art thumbnail for mp3 files
- [ ] Add thumbnail for video files 
- [ ] Add remove tag option
- [ ] Add remove category option
- [ ] Add remove folder option
- [ ] Implement edit tag
- [ ] Add moving option to file grouping

Future  tasks
- [ ] Microsoft Windows support
- [ ] Mac OS support
- [ ] Option to specify default program for file opening  
- [ ] Currently using a MySQL database which is very naive. Make a portable MySQL database or SQLite instead (SQLite failed in 1.0.0 for some reason)
- [ ] Make tags portable ie. introduce a method to save tags in a specified folder
- [ ] Listen to folder changes (File insertions and deletions) and update the database accordingly


## Special thanks

For [szwacz](https://github.com/szwacz) to use the [boilerplate](https://github.com/szwacz/electron-boilerplate) code.

## License
Licensed under MIT lice
