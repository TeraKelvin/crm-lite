import Image from "next/image";

export default function HelpPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          CRM-Lite User Guide
        </h1>
        <p className="text-lg text-gray-600">
          Everything you need to know to manage your deals effectively
        </p>
      </div>

      {/* Table of Contents */}
      <nav className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <a href="#getting-started" className="text-blue-600 hover:underline">Getting Started</a>
          <a href="#dashboard" className="text-blue-600 hover:underline">Dashboard</a>
          <a href="#deals" className="text-blue-600 hover:underline">Managing Deals</a>
          <a href="#forecasting" className="text-blue-600 hover:underline">Forecasting</a>
          <a href="#stakeholders" className="text-blue-600 hover:underline">Stakeholders</a>
          <a href="#competitors" className="text-blue-600 hover:underline">Competitors</a>
          <a href="#meddic" className="text-blue-600 hover:underline">MEDDIC Qualification</a>
          <a href="#activities" className="text-blue-600 hover:underline">Activity Timeline</a>
          <a href="#files" className="text-blue-600 hover:underline">File Management</a>
        </div>
      </nav>

      {/* Getting Started */}
      <section id="getting-started" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            CRM-Lite is your enterprise deal management platform. Log in with your credentials
            to access your personalized dashboard and deal pipeline.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="/help-images/login.png"
              alt="Login page"
              width={700}
              height={400}
              className="w-full"
            />
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Dev Mode</h3>
            <p className="text-blue-700 text-sm">
              For testing, use the &quot;Quick Dev Login&quot; button to access the system without credentials.
            </p>
          </div>
        </div>
      </section>

      {/* Dashboard */}
      <section id="dashboard" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dashboard Overview</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Your dashboard provides a quick overview of your sales performance and pipeline status.
          </p>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <Image
              src="/help-images/dashboard.png"
              alt="Dashboard"
              width={700}
              height={400}
              className="w-full"
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Quota Attainment</h3>
              <p className="text-gray-600 text-sm">
                Track your year-to-date closed deals against your annual goal.
                The progress bar shows your current attainment percentage.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Pipeline Overview</h3>
              <p className="text-gray-600 text-sm">
                See deal counts by stage: Courting, Registered, Quoted, Won, and Closed/Lost.
                Click any stage to filter your deals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Managing Deals */}
      <section id="deals" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Deals</h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Deals List</h3>
            <p className="text-gray-700 mb-4">
              View all your deals in a card-based layout. Each card shows key information
              including deal value, gross profit, stage, and forecasting data.
            </p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <Image
                src="/help-images/deals-list.png"
                alt="Deals list"
                width={700}
                height={400}
                className="w-full"
              />
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Deal Card Information</h4>
            <ul className="text-gray-700 text-sm space-y-2">
              <li><span className="font-medium">Value:</span> Total deal amount</li>
              <li><span className="font-medium">GP:</span> Gross Profit (shown in green)</li>
              <li><span className="font-medium">Stage Badge:</span> Current deal stage (color-coded)</li>
              <li><span className="font-medium">Probability:</span> e.g., &quot;10% → $25,000&quot; shows weighted value</li>
              <li><span className="font-medium">Forecast Category:</span> PIPELINE, BEST CASE, COMMIT, or OMIT</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating a New Deal</h3>
            <p className="text-gray-700 mb-4">
              Click &quot;+ New Deal&quot; to create a deal. Enter the deal name, client company,
              value, gross profit, and initial stage.
            </p>
            <div className="rounded-lg overflow-hidden border border-gray-200">
              <Image
                src="/help-images/new-deal.png"
                alt="Create new deal"
                width={700}
                height={400}
                className="w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Forecasting */}
      <section id="forecasting" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Forecasting</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Each deal has forecasting tools to help you predict pipeline value and
            manage your commit.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Probability & Weighted Value</h3>
              <p className="text-gray-600 text-sm">
                Set a probability percentage (0-100%) using the slider. The weighted value
                is automatically calculated: Deal Value × Probability = Weighted Value.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-2">Expected Close Date</h3>
              <p className="text-gray-600 text-sm">
                Set when you expect the deal to close. The system shows days remaining
                and highlights overdue deals in red.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Forecast Categories</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Commit</div>
                <div className="text-xs">High confidence, verbal agreement</div>
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Best Case</div>
                <div className="text-xs">Strong opportunity, may close</div>
              </div>
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Pipeline</div>
                <div className="text-xs">Standard opportunity</div>
              </div>
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Omit</div>
                <div className="text-xs">Unlikely to close this period</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stakeholders */}
      <section id="stakeholders" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Stakeholder Management</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Track all the people involved in your deal. Understanding the buying committee
            is critical for enterprise sales success.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Stakeholder Roles</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-center text-sm">
                <div className="font-semibold">Champion</div>
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded text-center text-sm">
                <div className="font-semibold">Economic Buyer</div>
              </div>
              <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-center text-sm">
                <div className="font-semibold">Technical Buyer</div>
              </div>
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-center text-sm">
                <div className="font-semibold">Influencer</div>
              </div>
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-center text-sm">
                <div className="font-semibold">Blocker</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Adding Contacts</h4>
            <p className="text-gray-600 text-sm">
              Click &quot;+ Add Contact&quot; to add a stakeholder. Include their name, title,
              email, phone, and assign their role in the buying process. Mark one contact
              as &quot;Primary&quot; for your main point of communication.
            </p>
          </div>
        </div>
      </section>

      {/* Competitors */}
      <section id="competitors" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Competitor Tracking</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Know your competition. Track who you&apos;re up against and develop strategies
            to win.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Competitor Status</h4>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-red-100 text-red-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Active</div>
                <div className="text-xs">Still competing</div>
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Eliminated</div>
                <div className="text-xs">No longer in deal</div>
              </div>
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-center">
                <div className="font-semibold">Unknown</div>
                <div className="text-xs">Unclear status</div>
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Competitive Intelligence</h4>
            <p className="text-gray-600 text-sm mb-2">
              For each competitor, document:
            </p>
            <ul className="text-gray-600 text-sm space-y-1">
              <li><span className="text-red-600 font-medium">Strengths:</span> What they do well</li>
              <li><span className="text-green-600 font-medium">Weaknesses:</span> Where you can win</li>
              <li><span className="font-medium">Notes:</span> Strategy and battle cards</li>
            </ul>
          </div>
        </div>
      </section>

      {/* MEDDIC */}
      <section id="meddic" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">MEDDIC Qualification</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            MEDDIC is a proven enterprise sales qualification framework. Use it to
            ensure you&apos;re pursuing the right deals with the right approach.
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Score Indicator</h4>
            <p className="text-blue-700 text-sm">
              Your MEDDIC score (0-6) shows how well-qualified the deal is. Aim for
              4+ before committing significant resources.
            </p>
          </div>

          <div className="grid gap-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">M - Metrics</h4>
              <p className="text-gray-600 text-sm">
                Quantifiable measures of success. What business outcomes will justify this purchase?
                Example: &quot;Reduce processing time by 40%, save $100K annually&quot;
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">E - Economic Buyer</h4>
              <p className="text-gray-600 text-sm">
                The person with budget authority and final sign-off.
                Example: &quot;CFO Sarah Johnson - controls IT budget&quot;
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">D - Decision Criteria</h4>
              <p className="text-gray-600 text-sm">
                What criteria will they use to evaluate solutions?
                Example: &quot;ROI within 12 months, ease of integration, vendor support&quot;
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">D - Decision Process</h4>
              <p className="text-gray-600 text-sm">
                The steps and timeline to make a purchase decision.
                Example: &quot;IT review → Legal → CFO sign-off → Board approval&quot;
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">I - Identify Pain</h4>
              <p className="text-gray-600 text-sm">
                The business problems driving the purchase.
                Example: &quot;Manual processes costing 40 hours/week&quot;
              </p>
            </div>
            <div className="border-l-4 border-blue-500 pl-4">
              <h4 className="font-semibold text-gray-900">C - Champion</h4>
              <p className="text-gray-600 text-sm">
                Your internal advocate who sells on your behalf.
                Example: &quot;VP Ops Mike Chen - personally invested in success&quot;
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Activity Timeline */}
      <section id="activities" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Activity Timeline</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Log all your deal activities to maintain momentum and keep stakeholders informed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Activity Types</h4>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              <div className="bg-blue-100 text-blue-700 px-3 py-2 rounded text-center text-sm">
                Call
              </div>
              <div className="bg-green-100 text-green-700 px-3 py-2 rounded text-center text-sm">
                Email
              </div>
              <div className="bg-purple-100 text-purple-700 px-3 py-2 rounded text-center text-sm">
                Meeting
              </div>
              <div className="bg-orange-100 text-orange-700 px-3 py-2 rounded text-center text-sm">
                Demo
              </div>
              <div className="bg-gray-100 text-gray-700 px-3 py-2 rounded text-center text-sm">
                Note
              </div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Activity Alerts</h4>
            <p className="text-gray-600 text-sm">
              The system tracks &quot;days since last activity&quot; to help you identify
              deals that need attention:
            </p>
            <ul className="text-sm mt-2 space-y-1">
              <li><span className="text-gray-600">Gray badge:</span> 1-7 days (OK)</li>
              <li><span className="text-yellow-600">Yellow badge:</span> 8-14 days (Needs attention)</li>
              <li><span className="text-red-600">Red badge:</span> 15+ days (At risk)</li>
            </ul>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">Next Steps</h4>
            <p className="text-gray-600 text-sm">
              When logging activities, add next steps with due dates. Overdue next steps
              are highlighted to ensure nothing falls through the cracks.
            </p>
          </div>
        </div>
      </section>

      {/* Files */}
      <section id="files" className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">File Management</h2>
        <div className="space-y-4">
          <p className="text-gray-700">
            Store and organize all deal-related documents in one place.
          </p>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Internal Files</h4>
              <p className="text-gray-600 text-sm">
                Documents for your team only: battle cards, pricing sheets,
                internal notes, and competitive analysis.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">External Files</h4>
              <p className="text-gray-600 text-sm">
                Documents visible to clients: proposals, contracts, presentations,
                and spec sheets. Clients can access these via the Client Portal.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2">Tip</h4>
            <p className="text-yellow-700 text-sm">
              Always categorize files correctly. Internal files should never be
              shared with clients accidentally.
            </p>
          </div>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Tips for Success</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Keep Deals Updated</h4>
            <p className="text-gray-600 text-sm">
              Log activities within 24 hours. Accurate data leads to better forecasting.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Complete MEDDIC Early</h4>
            <p className="text-gray-600 text-sm">
              Fill in MEDDIC fields as you learn. Low scores early help you qualify out.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Map the Buying Committee</h4>
            <p className="text-gray-600 text-sm">
              Add all stakeholders, not just your main contact. Enterprise deals are won by committee.
            </p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-gray-900 mb-2">Track Competitors</h4>
            <p className="text-gray-600 text-sm">
              Know who you&apos;re up against. Update status as competitors are eliminated.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
