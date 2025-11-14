import * as vscode from 'vscode'
import { git } from './git'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('git-utils.push', async () => {
      await withProgress('Pushing changes…', async () => {
        await git(['push'])
      })
    }),
    vscode.commands.registerCommand('git-utils.pull', async () => {
      await withProgress('Pulling changes…', async () => {
        await git(['pull'])
      })
    }),
    vscode.commands.registerCommand('git-utils.append', async () => {
      await withProgress('Amending last commit…', async () => {
        await git(['add', '-A'])
        await git(['commit', '--amend', '--no-edit'])
      })
    }),
    vscode.commands.registerCommand('git-utils.sync', async () => {
      await withProgress('Syncing changes…', async () => {
        await git(['add', '-A'])
        await git(['commit', '-m', 'Sync'])
        await git(['push'])
      })
    }),
    vscode.commands.registerCommand('git-utils.push-force-with-lease', async () => {
      const result = await vscode.window.showWarningMessage(
        'Are you sure you want to force push?',
        { modal: true },
        'Yes',
      )

      if (result !== 'Yes') {
        return
      }

      await withProgress('Force pushing…', async () => {
        await git(['push', '--force-with-lease'])
      })
    }),
  )
}

export function deactivate() {}

function withProgress(title: string, callback: () => Promise<void>) {
  return vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title,
    },
    callback,
  )
}
