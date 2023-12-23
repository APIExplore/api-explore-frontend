import { create } from "zustand";
import { agentDomain } from "../constants/apiConstants";
import axios from "axios";

type AgentStore = {
  agentId: string;
  agentPid: string;
  agentLoading: boolean;
};

const useAgentStore = create<AgentStore>((set) => ({
  agentId: "1",
  agentPid: "16716",
  agentLoading: false,
  restoreAgent: async (agentId, agentPid) => {
    set(() => ({
      agentLoading: true,
    }));

    const agentData = await axios.post(`${agentDomain}/api/restart-api`, {
      id: agentId,
      pid: agentPid,
    });

    console.info(agentData.data);

    set(() => ({
      agentPid: agentData.data.PID,
    }));

    set(() => ({
      agentLoading: false,
    }));
  },
}));

export default useAgentStore;
