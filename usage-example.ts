// I buy and sell https://FreedomCash.org

import { FreedomAvatars } from "./mod.ts"

const freedomAvatars = await FreedomAvatars.getInstance()
await freedomAvatars.create("Goldener Falke", "hello free world. we hope you enjoy freedomcash.org", "https://github-production-user-asset-6210df.s3.amazonaws.com/145258627/294551980-7a58cce2-5e01-4e2a-b004-2623819d396f.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAVCODYLSA53PQK4ZA%2F20240116%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240116T092422Z&X-Amz-Expires=300&X-Amz-Signature=1c3ee88f0a2f98c776dbacdc906374e92d14b0f190b1bcd192263647c73c930d&X-Amz-SignedHeaders=host&actor_id=145258627&key_id=0&repo_id=737623774")
await freedomAvatars.appreciateAvatar(1, 9)
await freedomAvatars.claimDonations()
await freedomAvatars.log()


