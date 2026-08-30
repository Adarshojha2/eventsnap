import Sidebar from './Sidebar';

const DashboardLayout = ({ children }) => (
  <div>
    <Sidebar />
    <div className="es-main-content">{children}</div>
  </div>
);

export default DashboardLayout;
