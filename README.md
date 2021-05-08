## Documentation

* Explore the Terraform for Terraform [CLI](https://www.terraform.io/downloads.html).
* Explore the Nodejs for npm [CLI](https://nodejs.org/en/).
* Explore the Yarn for Yarn [CLI](https://classic.yarnpkg.com/en/docs/install#debian-stable).
* Explore the CDK for cdktf [CLI](https://github.com/hashicorp/terraform-cdk/blob/main/docs/cli-commands.md).


Add your AWS credentials as two environment variables, AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY, replacing AAAAAA with each respective values.
```shell
$ export AWS_ACCESS_KEY_ID=AAAAAA
$ export AWS_SECRET_ACCESS_KEY=AAAAA
```

# typescript-aws-iam

A CDK for Terraform application in TypeScript for IAM configuraiton.

## Usage

Install project dependencies

```shell
yarn install
```

Generate CDK for Terraform constructs for Terraform provides and modules used in the project.

```bash
cdktf get
```

You can now edit the `main.ts` file if you want to modify any code.

```typescript
vim main.ts
import { Construct } from 'constructs';
import { App, TerraformStack , TerraformOutput  } from 'cdktf';
import {AwsProvider, IamUser , IamGroup , IamRole  ,IamPolicy , IamPolicyAttachment} from "./.gen/providers/aws/";


class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    new AwsProvider(this, 'aws', {
      region: 'us-west-1',
    })

    const iamNewGroup = new IamGroup(this, 'Group', {
      name: "CDKtf-TypeScript-Group-Demo"
    })

    const iamNewUser = new IamUser(this, 'User', {
      name: "CDKtf-TypeScript-User-Demo",
      tags: {
        Name: 'CDKtf-TypeScript-User-Demo',
        Team: 'Devops',
        Company: 'Your compnay',
      },
    })

    const iamNewRole = new IamRole(this, "role", {
      name: "CDKtf-TypeScript-role-Demo",
      assumeRolePolicy: JSON.stringify({
          "Version": "2012-10-17",
          "Statement": [
              {
                  "Action": "sts:AssumeRole",
                  "Principal": {
                      "Service": "ec2.amazonaws.com"
                  },
                  "Effect": "Allow",
              }
          ]
      }),
      tags: {
        Name: 'CDKtf-TypeScript-role-Demo',
        Team: 'Devops',
        Company: 'Your compnay',
      },
    })

    const iamNewPolicy = new IamPolicy(this, 'policy', {
      name: "CDKtf-TypeScript-policy-Demo",
      policy : JSON.stringify({
        "Version": "2012-10-17",
        "Statement": [
            {
                "Action": "*",
                "Resource": [
                  "arn:aws:ec2:*:*:client-vpn-endpoint/*"
                ],
                "Effect": "Allow",
            }
        ]
      }),    
      description : "This policy is for typescript demo",
    })

    const iamAttachment = new IamPolicyAttachment (this , 'iampolicyattachement',{
      name: "CDKtf-TypeScript-iam-attachment-Demo",
      groups : [iamNewGroup.name],
      roles: [iamNewRole.name],
      policyArn: iamNewPolicy.arn,
      users: [iamNewUser.name]
    })
    
    new TerraformOutput(this, 'iam_Group', {
      value: iamNewGroup.name,
    })

    new TerraformOutput(this, 'iam_username', {
      value: iamNewUser.name,
    })

    new TerraformOutput(this, 'iam_role', {
      value: iamNewRole.arn,
    })
  
    new TerraformOutput(this, 'iam_policy', {
      value: iamNewPolicy.arn,
    })

    new TerraformOutput(this, 'iam_attachemnt', {
      value: iamAttachment.name,
    })
  }
}

const app = new App();
new MyStack(app, 'aws-iam');
app.synth();
```

Compile the TypeScript application

```bash
tsc
```
At this step you can run code with two different way:

# The first way:

Generate Terraform configuration

```bash
cdktf synth
```

The above command will create a folder called `cdktf.out` that contains all Terraform JSON configuration that was generated.

Run Terraform commands

```bash
cd cdktf.out
terraform init
terraform plan
terraform apply
```

# The second way:

Run cdktf commands

```bash
cdktf deploy
```
