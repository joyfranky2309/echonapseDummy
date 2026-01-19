import Sidebar from "../Sidebar";

function AppLayout({ children }) {
  return (
    <>
      <Sidebar />
      <main
        style={{
          marginLeft: "300px", // sidebar width + gap
          padding: "30px",
        }}
      >
        {children}
      </main>
    </>
  );
}

export default AppLayout;
