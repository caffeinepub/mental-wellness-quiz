import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Quiz {
    questions: Array<Question>;
}
export interface Question {
    questionText: string;
    correctAnswerIndex: bigint;
    options: Array<string>;
}
export type Time = bigint;
export interface Attempt {
    answers: Array<bigint>;
    score: bigint;
    timestamp: Time;
}
export interface backendInterface {
    addQuestion(questionText: string, options: Array<string>, correctAnswerIndex: bigint): Promise<void>;
    getAllAttempts(): Promise<Array<[Principal, Array<Attempt>]>>;
    getAllQuestions(): Promise<Array<Question>>;
    getLeaderboard(): Promise<Array<[Principal, bigint]>>;
    getMyAttempts(): Promise<Array<Attempt> | null>;
    getQuiz(): Promise<Quiz | null>;
    getUserAttempts(user: Principal): Promise<Array<Attempt> | null>;
    submitAnswers(answers: Array<bigint>): Promise<bigint>;
}
