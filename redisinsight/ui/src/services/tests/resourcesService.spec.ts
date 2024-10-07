/*
  eslint-disable global-require
*/

import { cloneDeep } from 'lodash'

Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost'
  },
  writable: true
})

const OLD_ENV = cloneDeep(riConfig)

beforeEach(() => {
  jest.resetModules()
  // @ts-ignore
  riConfig = cloneDeep(OLD_ENV)
})
afterAll(() => {
  // @ts-ignore
  riConfig = cloneDeep(OLD_ENV)
})

describe('getOriginUrl', () => {
  test('shoud return url with absolute path', () => {
    const { getOriginUrl } = require('../resourcesService')

    expect(getOriginUrl()).toEqual('http://localhost:5001/')
  })

  test('shoud return origin with not absolute path', () => {
    window.riConfig.app.type = 'web'
    window.riConfig.app.env = 'production'

    const { getOriginUrl } = require('../resourcesService')
    expect(getOriginUrl()).toEqual('http://localhost')
  })
})

describe('getPathToResource', () => {
  test('shoud return url with absolute path', () => {
    const { getPathToResource } = require('../resourcesService')

    expect(getPathToResource('data/file.txt')).toEqual('http://localhost:5001/data/file.txt')
  })

  test('shoud return origin with not absolute path', () => {
    window.riConfig.app.type = 'web'
    window.riConfig.app.env = 'production'

    const { getPathToResource } = require('../resourcesService')
    expect(getPathToResource('data/file.txt')).toEqual('http://localhost/data/file.txt')
  })
})
