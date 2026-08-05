import { useState } from "react";

import ComplaintForm from "../components/ComplaintForm";
import Dashboard from "../components/Dashboard";
import History from "../components/History";

function Home() {
  const [refresh, setRefresh] = useState(false);

  const refreshData = () => {
    setRefresh((prev) => !prev);
  };

  return (
    <>
      <ComplaintForm onComplaintAdded={refreshData} />

      <Dashboard refresh={refresh} />

      <History refresh={refresh} />
    </>
  );
}

export default Home;