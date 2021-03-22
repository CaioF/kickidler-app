import React, { Component } from 'react'
import { Chart } from "react-google-charts";

export default class Graphics extends Component {
  state = {
      data: []
    };

    componentDidMount() {
        // Call our fetch function below once the component mounts
      this.callBackendAPI()
        .then(res => {
          this.setState({ data: res.express });
          console.log(this.state);
        })
        .catch(err => console.log(err));
    }
      // Fetches our GET route from the Express server. (Note the route we are fetching matches the GET route from server.js
    callBackendAPI = async () => {
      const response = await fetch('/graphic-backend'); //IPv4
      const body = await response.json();

      if (response.status !== 200) {
        throw Error(body.message)
      }
      return body;
    };

  render() {
    return (
      <div className="container-contact100">
        <Chart
          chartType="ColumnChart"
          data={[
            ['Продавец', 'Количество КП'],
            ['User 1', this.state.data[0]],
            ['User 2', this.state.data[1]],
            ['User 3', this.state.data[2]]
          ]}
          width="80%"
          height="500px"
        />
      </div>
    );
  }
}
