import { _shellCommandAsync } from "./shell";

const generate = ({ uid, domain, webRoot }) => async (logger = () => {}) => {
  let output = await _shellCommandAsync(
    `acme.sh --issue -w ${webRoot} -d ${domain} --force`,
    {
      cwd: webRoot,
      uid
    }
  )(logger);

  // Get last 4 lines
  const tmp = output.trim().split("\n");
  output = tmp.slice(tmp.length - 4).join("\n");
  console.log(output);
};

const SSLCert = {
  generate
};
export default SSLCert;
