#/** @jsx React.DOM */
React = require 'react'
Component = require './component'


App = React.createClass
  render: ->
    return (
      <div>
        <h1>NodeJS + browserify + ReactJS + CoffeeScript example!</h1>
        <div>Hello {Component.hello}!</div>
      </div>
    )

React.render <App/>, document.body
