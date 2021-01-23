import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  commands,
  services,
  window as Window,
  workspace,
} from "coc.nvim"
import {
  ExecuteCommandParams,
  VersionedTextDocumentIdentifier,
} from "vscode-languageserver-protocol"

interface Config {
  filetypes?: string[]
  cssInJs?: boolean
}

const DEFAULT_FILETYPES = [
  "css",
  "less",
  "postcss",
  "scss",
  "sugarss",
  "vue",
  "wxss",
]

export async function activate(context: ExtensionContext): Promise<void> {
  const config = workspace.getConfiguration().get<Config>("stylelintplus", {})
  let documentSelector = config.filetypes || DEFAULT_FILETYPES
  if (config.cssInJs) {
    documentSelector = [
      ...documentSelector,
      "javascript",
      "javascriptreact",
      "typescript",
      "typescriptreact",
    ]
  }

  const serverOptions: ServerOptions = {
    args: ["--node-ipc"],
    module: require.resolve("stylelint-lsp"),
    options: {
      cwd: workspace.root,
    },
    transport: TransportKind.ipc,
  }

  const clientOptions: LanguageClientOptions = {
    documentSelector,
    diagnosticCollectionName: "stylelintplus",
    outputChannelName: "stylelintplus",
    synchronize: {
      configurationSection: "stylelintplus",
      fileEvents: [
        workspace.createFileSystemWatcher("**/.stylelintignore"),
        workspace.createFileSystemWatcher("**/stylelint.config.js"),
        workspace.createFileSystemWatcher(
          "**/.stylelintrc{,.json,.yaml,.yml,.js}"
        ),
        workspace.createFileSystemWatcher("**/package.json"),
      ],
    },
  }

  const client = new LanguageClient(
    "stylelintplus",
    "stylelint language server",
    serverOptions,
    clientOptions
  )

  const { subscriptions } = context
  subscriptions.push(services.registLanguageClient(client))
  subscriptions.push(
    commands.registerCommand("stylelintplus.applyAutoFixes", async () => {
      const doc = await workspace.document
      if (!doc) {
        return
      }

      const textDocument: VersionedTextDocumentIdentifier = {
        uri: doc.uri,
        version: doc.version,
      }
      const params: ExecuteCommandParams = {
        command: "stylelint.applyAutoFixes",
        arguments: [textDocument],
      }

      await client.sendRequest("workspace/executeCommand", params).catch(() => {
        Window.showErrorMessage(
          "Failed to apply stylelint fixes to document.",
          "error"
        )
      })
    })
  )
}
