import { _homeDir, _shellCommandAsync } from "./shell";

//TODO: acme.sh command not found
const generate = ({ uid, user, domain, webRoot }) => async (
  logger = () => {}
) => {
  const homeDir = await _homeDir(user);
  let output = await _shellCommandAsync(
    `${homeDir}/.acme.sh/acme.sh --issue -w ${webRoot} -d ${domain} --force`,
    {
      cwd: webRoot,
      uid
    }
  )(logger);

  // Get last 4 lines
  const tmp = output.trim().split("\n");
  output = tmp.slice(tmp.length - 4).join("\n");
  return output;
};

const SSLCert = {
  generate
};
export default SSLCert;
