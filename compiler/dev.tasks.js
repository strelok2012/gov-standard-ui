const { Listr } = require('listr2');
const chokidar = require('chokidar');
const path = require('path');
const ora = require('ora');

(async () => {
  const execa = (await import('execa')).command;

  const tasks = new Listr([
    {
      title: 'Clean output',
      task: () =>
        execa('yarn clean').catch(() => {
          throw new Error('Cannot remove output directory');
        })
    },
    {
      title: 'Compile Vue Components',
      task: () =>
        execa('node ./compiler/platforms/vue').catch((error) => {
          throw new Error('Error compiling Vue' + error);
        })
    },
    {
      title: 'Bundle Vue',
      task: () =>
        execa('yarn lerna --scope=@gov-standard-ui/vue build').catch((error) => {
          throw new Error('Error bundling Vue ' + error);
        })
    },
    {
      title: 'Launch Watcher',
      task: async (ctx, task) => {
        task.title = 'Watching for changes';

        return chokidar
          .watch(['src/**/*', 'helpers/**/*', 'models/**/*', 'styles/**/*'])
          .on('all', async (event, pathName) => {
            if (event !== 'change') {
              return;
            }

            const file = path.parse(pathName);
            const name = file.dir.replace('src\\', '');
            const spinner = ora(`Changed ${name}, compiling... `).start();

            try {
              await execa('node ./compiler/platforms/vue --dev');
              await execa('yarn lerna --scope=@gov-standard-ui/vue build');
            } catch (e) {
              spinner.text = `Error compiling ${e.message}.`;
              spinner.fail();

              return;
            }

            spinner.text = 'Compiled successfully.';
            spinner.succeed();
          });
      },
      options: {
        persistentOutput: true
      }
    }
  ]);

  tasks.run().catch((err) => {
    console.error(err);
  });
})();
