const archiver = require('archiver');
const path = require('path');
const fs = require('fs-extra');

const { widgetName } = require('./package.json');
const paths = require('./paths');

// https://stackoverflow.com/a/51518100/1900505
const zipToFolders = async () => {
  try {
    const source = path.join(process.cwd(), 'build');
    const targetFolder = path.join(process.cwd(), 'dist');
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder);
    const targetFile = path.join(targetFolder, '_temp_' + widgetName);
    if (fs.existsSync(targetFile)) fs.unlinkSync(targetFile);
    const archive = archiver('zip', { zlib: { level: 9 } });
    const stream = fs.createWriteStream(targetFile);

    await new Promise((resolve, reject) => {
      archive
        .directory(source, false)
        .on('error', err => reject(err))
        .pipe(stream);

      stream.on('close', () => resolve());
      archive.finalize();
      const finalFile = path.join(targetFolder, widgetName);
      if (fs.existsSync(finalFile)) fs.unlinkSync(finalFile);
      fs.renameSync(targetFile, `${path.join(targetFolder, widgetName)}.mpk`);
    });

    console.log(`Generated ${widgetName}.mpk`); // eslint-disable-line no-console

    const { mxProjectRootDir } = paths;
    if (mxProjectRootDir) {
      await fs.copy(
        `./dist/${widgetName}.mpk`,
        `${mxProjectRootDir}/widgets/${widgetName}.mpk`
      );

      console.log(`Copied to your Mendix project: ${mxProjectRootDir}`); // eslint-disable-line no-console
    }
  } catch (err) {
    console.error(err); // eslint-disable-line no-console
    process.exit(1);
  }
};

zipToFolders();
