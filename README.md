# Obsidian local images

**This plugin is in early development, backups are a good idea ;)**

Finds hotlinked images in your notes, downloads and saves them locally and finally adjusts the link in your note to point to the local file.

This plugin will respect your settings of where new files are saved. Obsidian settings -> Files & Links -> Default location for new notes.

## Development

```
# Start the bunlder in watch mode
npm run dev

# It's useful to set a symlink so you don't have to copy files over constantly
ln -s /home/user/code/obsidian-local-images /home/user/notes/dev/.obsidian/plugins/local-images
```
