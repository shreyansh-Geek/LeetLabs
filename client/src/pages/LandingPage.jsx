import LeetLabsLogoLight from '../assets/Leetlabs-logo-light.png';

export default function LandingPage() {
  return (
    <div className="p-4">
      <div className="flex flex-col items-center gap-4">
        <img
          src={LeetLabsLogoLight}
          alt="LeetLabs logo Light"
          className="w-60 h-25 object-contain" // Adjust size here
        />
        <h1 className="text-3xl font-bold text-yellow-500">
          Welcome to <span className='underline underline-offset-auto'>LeetLabs</span>!
        </h1>
      </div>

      <p className="mt-4 text-lg text-gray-600">
        An online coding platform inspired by LeetCode, Codeforces, and HackerRank.
      </p>
    </div>
  );
}
