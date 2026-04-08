"use client";

import { useQuery } from "@tanstack/react-query";
import { mockDashboardData } from "@/lib/mock-data";

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => {
      // Simulate network latency
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // In a real scenario, we would use apiClient here:
      // const response = await apiClient.get('/dashboard');
      // return response.data;
      
      return mockDashboardData;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
