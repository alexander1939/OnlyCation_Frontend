export interface AssessmentsContextType {
  error: string | null;
  myRating: number | null;
  getMyRating: () => Promise<void>;
}
