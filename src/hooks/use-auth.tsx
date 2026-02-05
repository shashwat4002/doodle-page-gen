import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
  fullName: string;
  role: "STUDENT_RESEARCHER" | "MENTOR" | "ADMIN";
  academicLevel?: string | null;
  intendedFieldOfStudy?: string | null;
};

type MeResponse = {
  user: User | null;
};

export const useCurrentUser = () => {
  return useQuery<MeResponse>({
    queryKey: ["currentUser"],
    queryFn: () => api.get<MeResponse>("/auth/me"),
    retry: false,
  });
};

type LoginInput = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

type RegisterInput = {
  email: string;
  password: string;
  fullName: string;
  academicLevel?: string;
  intendedFieldOfStudy?: string;
  researchInterests?: string[];
  skillTags?: string[];
  role?: "STUDENT_RESEARCHER" | "MENTOR";
};

export const useAuthActions = () => {
  const queryClient = useQueryClient();

  const login = useMutation({
    mutationFn: (input: LoginInput) =>
      api.post<{ user: User }>("/auth/login", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const register = useMutation({
    mutationFn: (input: RegisterInput) =>
      api.post<{ user: User }>("/auth/register", input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });

  const logout = useMutation({
    mutationFn: () => api.post<void>("/auth/logout"),
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: ["currentUser"] });
    },
  });

  return { login, register, logout };
};

