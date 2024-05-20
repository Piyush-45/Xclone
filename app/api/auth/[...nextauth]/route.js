import NextAuth from "next-auth";

import GoogleProvider from "next-auth/providers/google"

const handler = NextAuth({
  providers:[
    GoogleProvider({
      clientId:process.env.GOOGLE_CLIENT_ID,
      clientSecret:process.env.GOOGLE_CLIENT_SECRET
    }),
  ],
  callbacks: {
  async session({ session, token }) {
    // Modify the session object
    session.user.username = session.user.name
      .split(' ')
      .join('')
      .toLocaleLowerCase();

    // Add a new property to the session.user object
    session.user.uid = token.sub;

    // Return the modified session object
    return session;
  },
},
});


export {handler as GET, handler as POST}
