import Button from './components/Button';
import StatusBadge from './components/StatusBadge';
import SummaryCard from './components/SummaryCard';

const summary = [
  { label: 'Active projects', value: '12', note: '+2 this month' },
  { label: 'Tasks completed', value: '84%', note: '+6% this week' },
  { label: 'Open issues', value: '7', note: '3 need attention' },
  { label: 'Team members', value: '18', note: 'Across 4 teams' },
];

const projects = [
  { name: 'Website redesign', owner: 'Maya', due: '18 Nov 2026', status: 'On track' as const },
  { name: 'Customer portal', owner: 'Omar', due: '24 Nov 2026', status: 'Needs attention' as const },
  { name: 'Inventory dashboard', owner: 'Lina', due: '02 Dec 2026', status: 'Delayed' as const },
];

export default function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#overview">Northstar</a>
        <nav aria-label="Main navigation">
          <a className="nav-item nav-item--active" href="#overview">Overview</a>
          <a className="nav-item" href="#projects">Projects</a>
          <a className="nav-item" href="#team">Team</a>
          <a className="nav-item" href="#settings">Settings</a>
        </nav>
        <p className="sidebar__note">Workspace<br /><strong>Product team</strong></p>
      </aside>

      <main className="main-content" id="overview">
        <header className="topbar">
          <div>
            <p className="eyebrow">Workspace / Overview</p>
            <h1>Good morning, Maya</h1>
          </div>
          <Button variant="secondary">View activity</Button>
        </header>

        <section aria-labelledby="summary-heading">
          <div className="section-heading">
            <div><h2 id="summary-heading">At a glance</h2><p className="muted">A quick view of your team's work.</p></div>
            <Button>Create project</Button>
          </div>
          <div className="summary-grid">
            {summary.map((item) => <SummaryCard key={item.label} {...item} />)}
          </div>
        </section>

        <section className="card projects-card" id="projects" aria-labelledby="projects-heading">
          <div className="section-heading">
            <div><h2 id="projects-heading">Recent projects</h2><p className="muted">Latest team activity and delivery status.</p></div>
            <a className="text-link" href="#all-projects">View all</a>
          </div>
          <div className="table-wrap">
            <table>
              <thead><tr><th scope="col">Project</th><th scope="col">Owner</th><th scope="col">Due date</th><th scope="col">Status</th></tr></thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.name}>
                    <th scope="row">{project.name}</th>
                    <td>{project.owner}</td>
                    <td>{project.due}</td>
                    <td><StatusBadge status={project.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
