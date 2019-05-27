import * as Icon from 'react-feather';

import TaskStats from './task_stats';

class Task extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  hostname() {
    const node = this.node();
    return node && node.hostname();
  }

  node() {
    const { containerID } = this.props.task;
    const { stack } = this.props;
    const dashboard = stack.dashboard();
    const nodes = dashboard.nodes();

    return nodes.find(
      node => (node.stats().current.containers || []).find(
        container => container.id === containerID
      )
    );
  }

  nodeStats() {
    const { containerID } = this.props.task;

    const node = this.node();
    if (!node) return {};

    return node.stats();
  }

  containerStats(nodeStats) {
    const { containerID } = this.props.task;
    const container = this.props.manifest.containers.find(
      container => container.id === containerID
    );

    if (!container || !nodeStats) return null;

    return (nodeStats.containers || []).find(
      container => container.id === containerID
    );
  }

  stats() {
    const nodeStats = this.nodeStats();
    const current = this.containerStats(nodeStats.current);
    const previous = this.containerStats(nodeStats.previous);
    return { current: current || {}, previous: previous || {} };
  }

  highlightNode(state) {
    const node = this.node();

    if (!node) return false;

    this.setState({ highlight: state });
    $(`#node-${node.id}`).toggleClass('highlight', state);
  }

  level() {
    const { state } = this.props.task;

    switch (state) {
      case 'running':
        return 'success';
      default:
        return 'secondary';
    }
  }

  renderState() {
    const { state } = this.props.task;

    return (
      <div className={`badge bg-${this.level()}`}>
        {state}
      </div>
    );
  }

  renderMessage () {
    const { message, when } = this.props.task;
    const tooltip = moment(when).fromNow();
    return (
      <div
        title={tooltip}
        data-original-title={tooltip}
        data-toggle={'tooltip'}
        className={'badge bg-primary'}>
        {message}
      </div>
    );
  }

  render() {
    const { highlight } = this.state;
    const tooltip = this.hostname();

    return (
      <span className={'task ' + (highlight ? 'highlight' : '')}>
        <span className={'border'}>
          <Icon.Server
            size={'1em'}
            title={tooltip}
            data-toggle={'tooltip'}
            data-original-title={tooltip} />
          <div className={'badges'}>
            {this.renderState()}
            {this.renderMessage()}
          </div>
          <TaskStats stats={this.stats()} />
        </span>
      </span>
    );
  }
}

export default Task;
