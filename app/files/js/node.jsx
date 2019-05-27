import NodeStats from './node_stats';

class Node extends React.Component {
  constructor(props) {
    super(props);
    this.state = { stats: { previous: {}, current: {} } };
  }

  hostname() {
    const { hostname } = this.props.node;
    return hostname;
  }

  stats() {
    return this.state.stats;
  }

  leader() {
    return this.props.node.leader;
  }

  manager() {
    return this.props.node.role === 'manager';
  }

  roleClass() {
    if (this.manager()) {
      return 'primary';
    } else {
      return 'info';
    }
  }

  roleBadge() {
    const { minimized } = this.props;
    const { role } = this.props.node;
    const label = {
      manager: { abbrev: 'M', full: 'Manager', level: 'primary' },
      worker: { abbrev: 'W', full: 'Worker', level: 'info' }
    }[role];
    const tooltip = minimized ? label.full : '';

    return (
      <span
        title={tooltip}
        data-original-title={tooltip}
        data-toggle={'tooltip'}
        className={`badge badge-${label.level}`}>
        {minimized ? label.abbrev : label.full}
      </span>
    );
  }

  leaderBadge() {
    const { minimized } = this.props;
    const leader = this.leader();
    const label = minimized ? 'L' : 'Leader';
    return (
      <span
        title={minimized ? 'Leader' : ''}
        data-toggle={'tooltip'}
        className={`badge badge-success ${leader ? 'visible' : 'hidden'}`}>
        {label}
      </span>
    );
  }

  render() {
    const { minimized, node } = this.props;
    return (
      <div id={`node-${this.props.node.id}`} className={'node'}>
        <span className={'status'}></span>
        <h2 title={'Version: ' + node.version} className={'hostname'}>
          {this.hostname()}
        </h2>
        {this.leaderBadge()}
        {this.roleBadge()}

        <NodeStats
          key={'node_' + node.id + '_stats'}
          minimized={minimized}
          stats={this.stats().current}
        />
      </div>
    );
  }
}

export default Node;
