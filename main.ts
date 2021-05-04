import { Construct } from "constructs";
import { App, TerraformStack, TerraformOutput } from "cdktf";
import {
  AwsProvider,
  iam,
} from "./.gen/providers/aws/";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, "aws", {
      region: "us-west-1",
    });

    const iamNewGroup = new iam.IamGroup(this, "Group", {
      name: "CDKtf-TypeScript-Group-Demo",
    });

    const iamNewUser = new iam.IamUser(this, "User", {
      name: "CDKtf-TypeScript-User-Demo",
      tags: {
        Name: "CDKtf-TypeScript-User-Demo",
        Team: "Devops",
        Company: "Your compnay",
      },
    });

    const iamNewRole = new iam.IamRole(this, "role", {
      name: "CDKtf-TypeScript-role-Demo",
      assumeRolePolicy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "sts:AssumeRole",
            Principal: {
              Service: "ec2.amazonaws.com",
            },
            Effect: "Allow",
          },
        ],
      }),
      tags: {
        Name: "CDKtf-TypeScript-role-Demo",
        Team: "Devops",
        Company: "Your compnay",
      },
    });

    const iamNewPolicy = new iam.IamPolicy(this, "policy", {
      name: "CDKtf-TypeScript-policy-Demo",
      policy: JSON.stringify({
        Version: "2012-10-17",
        Statement: [
          {
            Action: "*",
            Resource: ["arn:aws:ec2:*:*:client-vpn-endpoint/*"],
            Effect: "Allow",
          },
        ],
      }),
      description: "This policy is for typescript demo",
    });

    new iam.IamUserGroupMembership(
      this,
      "iamusergroupmembership",
      {
        groups: [iamNewGroup.name],
        user: iamNewUser.name,
      }
    );

    const iamAttachment = new iam.IamPolicyAttachment(
      this,
      "iampolicyattachement",
      {
        name: "CDKtf-TypeScript-iam-attachment-Demo",
        groups: [iamNewGroup.name],
        roles: [iamNewRole.name],
        policyArn: iamNewPolicy.arn,
        users: [iamNewUser.name],
      }
    );

    new TerraformOutput(this, "iam_Group", {
      value: iamNewGroup.name,
    });

    new TerraformOutput(this, "iam_username", {
      value: iamNewUser.name,
    });

    new TerraformOutput(this, "iam_role", {
      value: iamNewRole.arn,
    });

    new TerraformOutput(this, "iam_policy", {
      value: iamNewPolicy.arn,
    });

    new TerraformOutput(this, "iam_attachemnt", {
      value: iamAttachment.name,
    });

  }
}

const app = new App();
new MyStack(app, "cdktf-typescript-aws-iam");
app.synth();
