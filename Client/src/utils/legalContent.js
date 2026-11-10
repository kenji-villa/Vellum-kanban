// Edit these three before publishing
export const LEGAL = {
  updated: "November 9, 2026",
  contactEmail: "davis78villa@gmail.com", 
  governingLaw: "the laws of Ethiopia", 
};

const L = (lead, text) => ({ lead, text });

export const TERMS = {
  title: "Terms of Service",
  subtitle: "The rules of the road for using Vellum, written to be read.",
  summary: [
    "Vellum is free to use while it's in active development.",
    "You own what you put in Vellum. We only use it to run the service for you and the people you share it with.",
    "Be kind and lawful: no abuse, spam, or attempts to break the service.",
    "You can download your data or delete your account at any time from Settings → Data.",
  ],
  sections: [
    {
      id: "acceptance",
      title: "Accepting these terms",
      blocks: [
        {
          type: "p",
          text: "By creating an account or using Vellum, you agree to these Terms of Service and to our Privacy Policy. If you don't agree, please don't use Vellum.",
        },
        {
          type: "p",
          text: "If you use Vellum on behalf of a team or organization, you confirm that you're allowed to accept these terms for it.",
        },
      ],
    },
    {
      id: "account",
      title: "Your account",
      blocks: [
        {
          type: "ul",
          items: [
            "You must be at least 13 years old, or older if the law where you live requires it.",
            "You can sign up with an email and password, or continue with Google. Give us accurate information.",
            "Keep your login details private. You're responsible for what happens under your account, so tell us if you think someone else has accessed it.",
            "One person, one account. To work together, share boards instead of sharing a login.",
          ],
        },
      ],
    },
    {
      id: "content",
      title: "Your content",
      blocks: [
        {
          type: "p",
          text: "Your boards, lists, tasks, comments, labels and the images you upload (like your profile photo and banner) are your content. You keep ownership of it.",
        },
        {
          type: "p",
          text: "You give Vellum a limited permission to store, display and process your content, only as needed to run the service. For example, showing a board to the teammates you shared it with, syncing changes live, and sending you notifications.",
        },
        {
          type: "p",
          text: "You're responsible for your content, and for having the right to upload it.",
        },
      ],
    },
    {
      id: "use",
      title: "Acceptable use",
      blocks: [
        { type: "p", text: "Please don't use Vellum to:" },
        {
          type: "ul",
          items: [
            "break the law, or upload content that is illegal, harassing, hateful or that infringes someone else's rights;",
            "send spam or unwanted invitations, including inviting someone again and again after they decline;",
            "try to read other people's data, get into other accounts, or get around access controls such as view-only roles;",
            "probe, overload, scrape or disrupt the service, or try to reverse engineer it;",
            "pretend to be someone else.",
          ],
        },
      ],
    },
    {
      id: "sharing",
      title: "Teams, sharing and roles",
      blocks: [
        {
          type: "ul",
          items: [
            L("Teammates.", "When you invite someone and they accept, you become teammates. Either of you can end that at any time."),
            L("Roles.", "A board's owner decides who can access it, either as an editor (can change things) or a viewer (can read, but not change)."),
            L("What others can see.", "People you share a board with can see its tasks, comments and activity. Teammates and other members can see the profile details described in our Privacy Policy."),
            L("Deleting a board.", "If an owner deletes a board, or deletes their account, the board is deleted for everyone who had access to it."),
            L("Removing a teammate", "also removes any shared board access between the two of you."),
          ],
        },
      ],
    },
    {
      id: "availability",
      title: "Availability and changes",
      blocks: [
        {
          type: "p",
          text: "Vellum is provided free while it's in development. We may add, change, limit or remove features, or stop the service, and we'll try to give notice of big changes. Bugs and downtime can happen, so keep your own backups using the export tools in Settings → Data.",
        },
      ],
    },
    {
      id: "data",
      title: "Your data, export and deletion",
      blocks: [
        {
          type: "p",
          text: "You can download a backup (JSON) or a task list (CSV), and you can delete your account, from Settings → Data. Deleting your account removes your profile and every board you own. Comments and activity you made on boards owned by other people may remain, without your name.",
        },
      ],
    },
    {
      id: "termination",
      title: "Suspension and ending your account",
      blocks: [
        {
          type: "p",
          text: "We may suspend or end an account for serious or repeated violations of these terms, for security reasons, or if the law requires it. We'll try to explain why. You can stop using Vellum, or delete your account, whenever you like.",
        },
      ],
    },
    {
      id: "warranty",
      title: "No warranties",
      blocks: [
        {
          type: "p",
          text: "Vellum is provided \u201Cas is\u201D and \u201Cas available\u201D, without warranties of any kind, whether express or implied, including fitness for a particular purpose and non-infringement. We don't promise that the service will be uninterrupted or error-free, or that your data will never be lost.",
        },
      ],
    },
    {
      id: "liability",
      title: "Limitation of liability",
      blocks: [
        {
          type: "p",
          text: "To the fullest extent the law allows, Vellum and the people who make it are not liable for indirect, incidental, special or consequential damages, or for lost data, profits or goodwill, arising from your use of the service. Our total liability for any claim is limited to the amount you paid us in the previous 12 months, which is zero while Vellum is free.",
        },
        {
          type: "p",
          text: "Some places don't allow certain limits, so parts of this section may not apply to you.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to these terms",
      blocks: [
        {
          type: "p",
          text: "We may update these terms from time to time. We'll change the date at the top, and for significant changes we'll let you know in the app or by email. If you keep using Vellum after a change, you accept the new terms.",
        },
      ],
    },
    {
      id: "law",
      title: "Governing law",
      blocks: [
        {
          type: "p",
          text: `These terms are governed by ${LEGAL.governingLaw}. Any dispute will be handled by the courts that have jurisdiction there, unless the law where you live says otherwise.`,
        },
      ],
    },
  ],
};

export const PRIVACY = {
  title: "Privacy Policy",
  subtitle: "What we collect, why, and the choices you have, in plain language.",
  summary: [
    "We collect only what we need to run Vellum: your account, your profile, and the boards and tasks you create.",
    "We don't sell your data and we don't show ads.",
    "Teammates only see what you choose to share, and your phone number and full email are never shown to other people.",
    "You can download everything or delete your account in Settings → Data.",
  ],
  sections: [
    {
      id: "collect",
      title: "What we collect",
      blocks: [
        {
          type: "ul",
          items: [
            L("Account.", "Your name, your email address and a hashed (one-way encrypted) password. If you sign in with Google, Google gives us your name and email. We never see your Google password."),
            L("Profile (all optional).", "Job title, department, bio, country, city, phone number, skills, languages, website and social links, a profile photo and a banner image."),
            L("Your work.", "Boards, lists, tasks (titles, descriptions, priorities, due dates, labels, assignees), comments, and the activity history of your tasks."),
            L("Team activity.", "Invitations you send or receive, your teammates, board sharing and roles, and your notifications."),
            L("Technical data.", "Our servers may record basic technical details such as IP address, browser type and timestamps in logs, for security and troubleshooting."),
          ],
        },
      ],
    },
    {
      id: "use",
      title: "How we use it",
      blocks: [
        {
          type: "ul",
          items: [
            "To run Vellum: showing your boards, syncing changes live and sending in-app notifications such as invitations, assignments, comments and deadline alerts.",
            "To sign you in and keep your account secure.",
            "To let people find you when they want to invite you, by searching your name or typing your exact email.",
            "To fix bugs, prevent abuse and improve the service.",
            "To meet legal obligations. We don't use your content for advertising.",
          ],
        },
      ],
    },
    {
      id: "visibility",
      title: "Who can see what",
      blocks: [
        {
          type: "ul",
          items: [
            L("Boards, tasks and comments:", "only you and the people you share a board with (its owner, editors and viewers)."),
            L("Search results:", "other signed-in people can find you by name and see your name, job title, photo and a masked email such as d***@gmail.com."),
            L("Your public profile:", "anyone signed in who opens your profile can also see your bio, banner, department, city and country, skills, languages and links."),
            L("Never shown to others:", "your phone number and your full email address."),
          ],
        },
      ],
    },
    {
      id: "google",
      title: "Sign in with Google",
      blocks: [
        {
          type: "p",
          text: "If you choose Google sign-in, we use Google's sign-in service to confirm who you are. Google shares your name and email with us. We don't get access to your Gmail, Drive, contacts or anything else in your Google account. Google handles its own data under its own privacy policy.",
        },
      ],
    },
    {
      id: "storage",
      title: "Cookies and local storage",
      blocks: [
        {
          type: "p",
          text: "Vellum doesn't use advertising or tracking cookies. To work properly, it keeps a few items in your browser's local storage:",
        },
        {
          type: "ul",
          items: [
            "your sign-in token, which keeps you signed in for a limited time;",
            "your preferences, such as theme, accent colour and defaults;",
            "alerts you've dismissed, your recent searches and the last board you opened.",
          ],
        },
        {
          type: "p",
          text: "You can clear these in your browser settings at any time, which will sign you out. Google's sign-in button may set its own cookies when you use it.",
        },
      ],
    },
    {
      id: "security",
      title: "How we protect it",
      blocks: [
        {
          type: "p",
          text: "Passwords are stored only as salted one-way hashes. The server checks your access on every request, so view-only members can't change a board and people can't open boards they haven't been given. Vellum is meant to be served over an encrypted (HTTPS) connection. No system is perfectly secure, so we can't guarantee absolute security.",
        },
      ],
    },
    {
      id: "sharing",
      title: "Who we share it with",
      blocks: [
        {
          type: "p",
          text: "We don't sell or rent your information. We only share it with:",
        },
        {
          type: "ul",
          items: [
            "the services that host Vellum and its database, which process data on our behalf;",
            "Google, if you use Google sign-in;",
            "authorities, when the law requires it or to protect people's safety and our service.",
          ],
        },
      ],
    },
    {
      id: "retention",
      title: "How long we keep it",
      blocks: [
        {
          type: "p",
          text: "We keep your information while your account is open. When you delete your account, your profile, your uploaded images and every board you own are deleted. Comments you left on boards owned by other people may remain, without your name. Logs and backups may take a limited time to be fully cleared.",
        },
      ],
    },
    {
      id: "rights",
      title: "Your choices and rights",
      blocks: [
        {
          type: "ul",
          items: [
            "Download your data (JSON or CSV) from Settings → Data.",
            "Change or remove your profile details any time on your profile page.",
            "Delete your account from Settings → Data.",
            "Depending on where you live, you may also have the right to ask for access, correction, deletion or objection. Contact us and we'll help.",
          ],
        },
      ],
    },
    {
      id: "children",
      title: "Children",
      blocks: [
        {
          type: "p",
          text: "Vellum isn't meant for children under 13. If we learn we have collected a child's information, we'll delete it.",
        },
      ],
    },
    {
      id: "changes",
      title: "Changes to this policy",
      blocks: [
        {
          type: "p",
          text: "We may update this policy. We'll change the date at the top and, for significant changes, tell you in the app or by email.",
        },
      ],
    },
  ],
};