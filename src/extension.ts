import * as vscode from 'vscode'
import { git } from './git'

export function activate(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.commands.registerCommand('git-utils.git-append', async () => {
      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: 'Amending last commit…',
        },
        async () => {
          await git(['add', '-A'])
          await git(['commit', '--amend', '--no-edit'])
        },
      )
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('git-utils.git-sync', async () => {
      const message = await vscode.window.showInputBox({
        prompt: 'Commit message',
        value: 'Sync',
      })

      if (message === undefined) {
        return
      }

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: 'Syncing changes…',
        },
        async () => {
          await git(['add', '-A'])
          await git(['commit', '-m', message || 'Sync'])
          await git(['push'])
        },
      )
    }),
  )

  context.subscriptions.push(
    vscode.commands.registerCommand('git-utils.git-push-force-with-lease', async () => {
      const result = await vscode.window.showWarningMessage(
        'Are you sure you want to force push?',
        { modal: true },
        'Yes',
      )

      if (result !== 'Yes') {
        return
      }

      await vscode.window.withProgress(
        {
          cancellable: false,
          location: vscode.ProgressLocation.Notification,
          title: 'Force pushing…',
        },
        async () => {
          await git(['push', '--force-with-lease'])
        },
      )
    }),
  )
}

export function deactivate() {}
