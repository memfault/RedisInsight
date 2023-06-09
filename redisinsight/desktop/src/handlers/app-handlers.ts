import { app } from 'electron'
import log from 'electron-log'
import { getBackendGracefulShutdown } from 'desktopSrc/services'
import { createWindow, getWindows } from 'desktopSrc/window'

export const initAppHandlers = () => {
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (getWindows()?.size === 0) createWindow()
  })

  app.on('certificate-error', (event, _webContents, _url, _error, _certificate, callback) => {
    // Skip error due to self-signed certificate
    event.preventDefault()
    callback(true)
  })

  app.on('window-all-closed', () => {
    log.info('window-all-closed')
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('continue-activity-error', (event, type, error) => {
    log.info('event', event)
    log.info('type', type)
    log.info('error', error)
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('quit', () => {
    try {
      getBackendGracefulShutdown?.()
    } catch (e) {
      // ignore any error
    }
  })
}
