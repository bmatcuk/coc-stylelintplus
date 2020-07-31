import {
  ExtensionContext,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
  TransportKind,
  services,
  workspace,
} from "coc.nvim"

export async function activate(context: ExtensionContext): Promise<void> {
  const documentSelector = [
    "css",
    "javascript",
    "javascriptreact",
    "less",
    "postcss",
    "scss",
    "sugarss",
    "typescript",
    "typescriptreact",
    "vue",
    "wxss",
  ]

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
}
