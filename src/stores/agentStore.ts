import { create } from "zustand";

type AgentStore = {
  agentId: string;
  agentPid: string;
};

const useAgentStore = create<AgentStore>((set) => ({
  agentId: "1",
  agentPid: "22944",
  setAgentPid: (pid: string) => {
    set(() => ({
      agentPid: pid,
    }));
  },
}));

export default useAgentStore;
