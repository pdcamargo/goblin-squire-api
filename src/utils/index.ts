import cli from 'cli-color';

export type Color =
  | 'black'
  | 'red'
  | 'green'
  | 'yellow'
  | 'blue'
  | 'magenta'
  | 'cyan'
  | 'white';

export type BgColor =
  | 'bgBlack'
  | 'bgRed'
  | 'bgGreen'
  | 'bgYellow'
  | 'bgBlue'
  | 'bgMagenta'
  | 'bgCyan'
  | 'bgWhite';

type Logger = (
  title: string,
  description: string,
  config?: {
    bg?: BgColor;
    color?: Color;
  }
) => void;

export const logger: Logger = (title, description, config = {}) => {
  const cliBg = cli[config.bg || 'bgGreen'];
  const cliColor = cli[config.color || 'black'];

  console.log(`${cliBg(cliColor(title))}: ${description}`);
};
