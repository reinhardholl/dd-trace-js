'use strict'

const opentracing = require('opentracing')
const Tracer = require('./opentracing/tracer')
const log = require('./log')

const noop = new opentracing.Span()

class DatadogTracer extends Tracer {
  constructor (config) {
    super(config)

    let ScopeManager
    let Scope

    if (process.env.DD_CONTEXT_PROPAGATION === 'false') {
      ScopeManager = require('./scope/noop/scope_manager')
      Scope = require('./scope/new/base')
    } else {
      ScopeManager = require('./scope/scope_manager')
      Scope = require('./scope/new/scope')
    }

    this._scopeManager = new ScopeManager()
    this._scope = new Scope()
  }

  trace (name, options, callback) {
    log.deprecate(
      'Tracer.trace',
      'Tracer.trace() is deprecated. Please use Tracer.startSpan() instead.'
    )

    if (!callback) {
      callback = options
      options = {}
    }

    callback(noop)
  }

  scopeManager () {
    log.deprecate(
      'Tracer.scopeManager',
      'Tracer.scopeManager() is deprecated. Please use Tracer.scope() instead.'
    )

    return this._scopeManager
  }

  scope () {
    return this._scope
  }

  currentSpan () {
    log.deprecate(
      'Tracer.currentSpan',
      'Tracer.currentSpan() is deprecated. Please use Tracer.scope().active() instead.'
    )

    return noop // return a noop span instead of null to avoid crashing the app
  }
}

module.exports = DatadogTracer
