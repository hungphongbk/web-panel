import { _homeDir, _shellCommandAsync, _shellWithUser } from "./shell";

//TODO: review bashrc problem
const generate = ({ uid, user, domain, webRoot }) => async (
  logger = () => {}
) => {
  const homeDir = await _homeDir(user);
  let output = await _shellCommandAsync(
    `${homeDir}/.acme.sh/acme.sh --issue -w ${webRoot} -d ${domain} --force`,
    _shellWithUser(uid)({
      cwd: webRoot
    })
  )(logger);

  // Get last 4 lines
  // const tmp = output.trim().split("\n");
  // output = tmp.slice(tmp.length - 4).join("\n");
  return output;
};

const SSLCert = {
  generate
};
export default SSLCert;
