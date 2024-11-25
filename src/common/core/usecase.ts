export abstract class Usecase<Input, Output> {
  abstract run(input: Input): Promise<Output>;
}
