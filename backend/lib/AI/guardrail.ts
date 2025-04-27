
import { CfnGuardrail } from 'aws-cdk-lib/aws-bedrock';
import { Construct } from 'constructs';

type CreateGuardrailProps = {
    appName: string
}

export function createGuardrail(
    scope: Construct,
    props: CreateGuardrailProps
) {

    // https://medium.com/@adtanasa/build-responsible-ai-applications-with-aws-cdk-and-aws-bedrock-guardrails-a7961dd84676 
    const guardrail = new CfnGuardrail(scope, `${props.appName}-MyBedrockGuardrail`, {
        name: `${props.appName}-MySafetyGuardrail`,
        description: `My Beadrock Guardrail created with AWS CDK for my ${props.appName} API to block hate speach, violence and insult`,
        blockedInputMessaging: 'Guardrail applied based on the input',
        blockedOutputsMessaging: 'Guardrail applied based on the output',
        contentPolicyConfig: {
            filtersConfig:[
                {
                    inputStrength: "HIGH",
                    outputStrength: "HIGH",
                    type: "SEXUAL"
                },
                {
                    inputStrength: "HIGH",
                    outputStrength: "HIGH",
                    type: "VIOLENCE"
                },
                {
                    inputStrength: "HIGH",
                    outputStrength: "HIGH",
                    type: "HATE"
                },
                {
                    inputStrength: "HIGH",
                    outputStrength: "HIGH",
                    type: "INSULTS"
                },
                {
                    inputStrength: "HIGH",
                    outputStrength: "HIGH",
                    type: "MISCONDUCT"
                },
                {
                    inputStrength: "NONE",
                    outputStrength: "NONE",
                    type: "PROMPT_ATTACK"
                }
            ]
        },
        sensitiveInformationPolicyConfig: {
            piiEntitiesConfig: [
                {
                    action : "BLOCK",
                    type : "EMAIL"
                },
                {
                    action : "ANONYMIZE",
                    type : "IP_ADDRESS"
                },
                {
                    action: "ANONYMIZE",
                    type: "PHONE"
                },
                {
                    action: "ANONYMIZE",
                    type: "NAME"
                }
            ],
            // regexesConfig: []
        },
        topicPolicyConfig: {
            topicsConfig: [
                {
                    name: 'In-Person Tutoring',
                    definition: 'Requests for face-to-face, physical tutoring sessions.',
                    examples: [
                        'Can you tutor me in person?',
                        'Do you offer home tutoring visits?',
                        'I need a tutor to come to my house.'
                    ],
                    type: 'DENY'
                },
                {
                    name: 'Non-Math Tutoring',
                    definition: 'Requests for tutoring in subjects other than mathematics.',
                    examples: [
                        'Can you help me with my English homework?',
                        'I need a science tutor.',
                        'Do you offer history tutoring?'
                    ],
                    type: 'DENY'
                },
                {
                    name: 'Non-6-12 Grade Tutoring',
                    definition: 'Requests for tutoring students outside of grades 6-12.',
                    examples: [
                        'Can you tutor my 5-year-old in math?',
                        'I need help with college-level calculus.',
                        'Do you offer math tutoring for adults?'
                    ],
                    type: 'DENY'
                }
            ],
        }, 
        wordPolicyConfig: {
            wordsConfig: [
                {text: 'in-person tutoring'},
                {text: 'home tutoring'},
                {text: 'face-to-face tutoring'},
                {text: 'elementary school'},
                {text: 'college'},
                {text: 'university'},
                {text: 'adult education'},
                {text: 'english tutoring'},
                {text: 'science tutoring'},
                {text: 'history tutoring'}
            ],
            managedWordListsConfig: [
                {type: 'PROFANITY'}
            ]
        },
        tags: [
            {
                key: 'purpose',
                value: 'math-tutoring-guardrail'
            },
            {
                key: 'environment',
                value: 'production'
            }
        ]
    })
    
    return guardrail
}