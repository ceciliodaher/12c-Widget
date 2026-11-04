import AppKit

// Partida do FinRPN (DEC-015): sem storyboard nem Xcode; o menu é montado em código.
let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.mainMenu = MainMenu.make()
app.run()
