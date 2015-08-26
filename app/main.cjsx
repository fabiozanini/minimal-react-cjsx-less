#/** @jsx React.DOM */
React = require 'react'


App = React.createClass
  render: ->
    return (
      <div>
        <h1>Hello world 22!</h1>
        <h2>test</h2>
      </div>
    )

React.render <App/>, document.body
