import { useState, useEffect } from "react";

export interface Reward {
  id: number;
  step: number;
  description: string;
}

export interface BattlePass {
  id: number;
  name: string;
  isActive: boolean;
  progress: number;
  maxSteps: number;
  rewards: Reward[];
}

export function useBattlePass() {
  const [battlePass, setBattlePass] = useState<BattlePass | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchActive = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/battlepass/active");
      const data = await res.json();
      setBattlePass(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActive();
  }, []);

  const createBattlePass = async (payload: { name: string; maxSteps: number; rewards: { step: number; description: string }[] }) => {
    try {
      const res = await fetch("http://localhost:4000/api/battlepass", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const newBP = await res.json();
      setBattlePass(newBP);
      return newBP;
    } catch (e) {
      console.error(e);
      return null;
    }
  };

  return { battlePass, loading, createBattlePass, refresh: fetchActive };
}
