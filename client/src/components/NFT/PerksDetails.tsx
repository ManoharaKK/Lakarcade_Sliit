'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { FiUsers, FiCalendar, FiMap, FiTag, FiBookOpen, FiMic, FiStar, FiAward, FiShield, FiEye, FiEdit3, FiGrid, FiSettings, FiMinus, FiUnlock, FiArchive, FiChevronDown } from 'react-icons/fi'

type SectionId = 'community' | 'membership' | 'accessLevel' | 'resourceScore'

export default function PerksDetails() {
  const [openSection, setOpenSection] = useState<SectionId | null>(null)

  const toggle = (id: SectionId) => {
    setOpenSection((prev) => (prev === id ? null : id))
  }

  return (
    <div className="mt-16 mx-auto px-4 sm:px-0 text-blackbrown">
      {/* Centered hero: title, description, image */}
      <section className="text-center mb-12">
       
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-blackbrown">NFT Perks &amp; Utility</h2>
        <p className="mt-3 text-sm sm:text-base text-blackbrown/80 mb-8 max-w-6xl mx-auto">
          Explore membership tiers, access levels, and resource unlock scores for Sigiri Bithusithuwam Heritage NFTs. Your NFT unlocks community benefits, cultural access, and exclusive digital resources.
        </p>
        <div className="group relative w-full mx-auto aspect-[21/9] overflow-hidden rounded-lg border border-lightbrown bg-[#F6E7CA]/20 mb-6 cursor-pointer">
          <Image
            src="/images/NFT/Bithusithuwan.png"
            alt="Sigiri Bithusithuwam Heritage – Perks & Utility"
            fill
            className="object-cover brightness-75 transition-[filter] duration-300 ease-out group-hover:brightness-100"
            sizes="(max-width: 768px) 100vw, 672px"
            priority
          />
          <div
            className="absolute inset-0 bg-black/50 transition-colors duration-300 ease-out group-hover:bg-black/0"
            aria-hidden
          />
        </div>
      </section>

      <div className="bg-lightbrown w-full h-[1px] mb-6" />
      {/* Section 1: Community Utility & Perks */}
      <div>
        <button
          type="button"
          onClick={() => toggle('community')}
          className="w-full py-4 flex items-center justify-between gap-4 text-left hover:opacity-90 transition-opacity"
          aria-expanded={openSection === 'community'}
        >
          <h3 className="text-2xl font-bold tracking-tight text-blackbrown">Community Utility &amp; Perks</h3>
          <FiChevronDown
            className={`shrink-0 w-6 h-6 text-[#693422] transition-transform duration-200 ${openSection === 'community' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: openSection === 'community' ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pb-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <p className="text-sm sm:text-base text-blackbrown/80 max-w-xl">
                Each Sigiri Bithusithuwam NFT unlocks a curated blend of community, cultural, and educational benefits.
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-lightbrown text-right">
                Randomized perks · Heritage focused · Utility driven
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiUsers className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Community Access</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Private heritage community (Discord / Telegram).</li>
            <li>Curated cultural discussions and updates.</li>
            <li>Voting rights on roadmap and drops.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiCalendar className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Event Access</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Priority access to launches &amp; webinars.</li>
            <li>Invites to virtual exhibitions and showcases.</li>
            <li>Tiered event access based on rarity.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiMap className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Heritage Site Visits</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Curated visits to key heritage locations.</li>
            <li>Educational Sigiriya and archaeology tours.</li>
            <li>Exclusive on-site photography sessions.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiTag className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Member Discounts</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Reduced pricing on future drops.</li>
            <li>Discounts on heritage merch &amp; books.</li>
            <li>Partner museum and event benefits.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiBookOpen className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Rare Books &amp; Research</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Access to curated research archives.</li>
            <li>Cultural eBooks and archaeology PDFs.</li>
            <li>Ideal for students and researchers.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiMic className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Expert Sessions</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Talks with historians &amp; archaeologists.</li>
            <li>Web3 and digital heritage insights.</li>
            <li>Live Q&amp;A and recorded masterclasses.</li>
          </ul>
        </div>

        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm md:col-span-2 lg:col-span-3 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiStar className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Exclusive Digital Content</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>High-resolution fresco art and behind-the-scenes restoration content.</li>
            <li>Documentary-style videos and early previews of new collections.</li>
            <li>Bonus digital collectibles that deepen each NFT&apos;s story.</li>
          </ul>
        </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-[1px] bg-[#693422]/60 shrink-0" aria-hidden />

      {/* Section 2: Membership & Access */}
      <div className="border-b border-lightbrown">
        <button
          type="button"
          onClick={() => toggle('membership')}
          className="w-full py-4 flex items-center justify-between gap-4 text-left hover:opacity-90 transition-opacity"
          aria-expanded={openSection === 'membership'}
        >
          <h3 className="text-2xl font-bold tracking-tight text-blackbrown">Membership &amp; Access – Detailed Explanation</h3>
          <FiChevronDown
            className={`shrink-0 w-6 h-6 text-[#693422] transition-transform duration-200 ${openSection === 'membership' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: openSection === 'membership' ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pb-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <p className="text-sm sm:text-base text-blackbrown/80 max-w-xl">
                Each NFT is assigned a structured membership tier that defines privileges, rarity, and how deeply holders can
                engage with Sri Lankan heritage resources.
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-lightbrown text-right">
                From Basic access to Patron-level cultural guardians
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
        {/* Basic */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiUsers className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Basic</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Entry-level membership</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Standard community access and public events.</li>
            <li>Limited exclusive content and basic discounts.</li>
            <li>Eligible to upgrade via future drops.</li>
          </ul>
        </div>

        {/* Standard */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiTag className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Standard</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Balanced benefits</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Priority event registration and selected expert talks.</li>
            <li>Enhanced member discounts and early NFT previews.</li>
            <li>Voting rights on selected community proposals.</li>
          </ul>
        </div>

        {/* Premium */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiStar className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Premium</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Advanced cultural access</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Guaranteed access to exclusive webinars &amp; sessions.</li>
            <li>Rare digital heritage resources and private Q&amp;A.</li>
            <li>Higher discount percentages and limited-edition drops.</li>
          </ul>
        </div>

        {/* VIP */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiAward className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">VIP</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">High-prestige membership</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Front-row access to major events and launches.</li>
            <li>Special recognition and direct channels to admins.</li>
            <li>Premium heritage site visit invitations and archives.</li>
          </ul>
        </div>

        {/* Patron – same row as VIP (md: 1 col each; lg: VIP 1 col, Patron 2 cols) */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm md:col-span-1 lg:col-span-2 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiShield className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Patron</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Elite cultural guardian</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80">
            <li>Lifetime premium access to all heritage content.</li>
            <li>Exclusive preservation reports and curated experiences.</li>
            <li>Highest voting authority and recognition as supporters.</li>
          </ul>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Access Level */}
      <div className="border-b border-lightbrown">
        <button
          type="button"
          onClick={() => toggle('accessLevel')}
          className="w-full py-4 flex items-center justify-between gap-4 text-left hover:opacity-90 transition-opacity"
          aria-expanded={openSection === 'accessLevel'}
        >
          <h3 className="text-2xl font-bold tracking-tight text-blackbrown">Access Level – What Your NFT Gives You</h3>
          <FiChevronDown
            className={`shrink-0 w-6 h-6 text-[#693422] transition-transform duration-200 ${openSection === 'accessLevel' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: openSection === 'accessLevel' ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pb-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <p className="text-sm sm:text-base text-blackbrown/80 max-w-xl">
                Each NFT is assigned one of the following access levels. The selected level defines how deeply you can
                interact with heritage content, community tools, and exclusive resources.
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-lightbrown text-right">
                View · Member · Contributor · Curator · Admin
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
        {/* View */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiEye className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">View</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Basic Viewing Access</p>
          <p className="text-blackbrown/80 mb-2">This level allows holders to:</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>View public heritage content</li>
            <li>Access standard NFT gallery collections</li>
            <li>Read selected cultural articles</li>
            <li>Join open community discussions</li>
            <li>Receive general announcements</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            This level is designed for collectors who want to explore and observe the heritage ecosystem without advanced privileges.
          </p>
          <p className="text-xs text-lightbrown italic">Best for: Casual collectors and first-time NFT buyers.</p>
        </div>

        {/* Member */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiUsers className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Member</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Active Community Access</p>
          <p className="text-blackbrown/80 mb-2">This level allows holders to:</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Everything included in View level</li>
            <li>Access members-only content</li>
            <li>Participate in community polls</li>
            <li>Register for selected events</li>
            <li>Unlock limited educational materials</li>
            <li>Receive member-only discounts</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            This level is ideal for users who want to actively engage in the heritage community.
          </p>
          <p className="text-xs text-lightbrown italic">Best for: Engaged collectors and cultural supporters.</p>
        </div>

        {/* Contributor */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiEdit3 className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Contributor</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Content &amp; Cultural Contributor Access</p>
          <p className="text-blackbrown/80 mb-2">This level allows holders to:</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Everything included in Member level</li>
            <li>Submit cultural discussions or insights</li>
            <li>Contribute research-based content (moderated)</li>
            <li>Access expanded digital archives</li>
            <li>Participate in closed expert sessions</li>
            <li>Priority registration for heritage programs</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            This level is suited for users who want to contribute knowledge and actively participate in preservation efforts.
          </p>
          <p className="text-xs text-lightbrown italic">Best for: Researchers, students, and cultural contributors.</p>
        </div>

        {/* Curator */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiGrid className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Curator</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Advanced Cultural Management Access</p>
          <p className="text-blackbrown/80 mb-2">This level allows holders to:</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Everything included in Contributor level</li>
            <li>Curate featured NFT collections</li>
            <li>Recommend heritage resources for publishing</li>
            <li>Moderate selected community sections</li>
            <li>Access premium digital archives</li>
            <li>Early access to rare NFT drops</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            This level is rare and intended for trusted community members.
          </p>
          <p className="text-xs text-lightbrown italic">Best for: Senior collectors and heritage ambassadors.</p>
        </div>

        {/* Admin */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm md:col-span-2 lg:col-span-2 transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiSettings className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Admin</h4>
          <p className="text-xs uppercase tracking-wide text-lightbrown mb-2">Full Administrative Access</p>
          <p className="text-blackbrown/80 mb-1 italic text-sm">This is the highest access level.</p>
          <p className="text-blackbrown/80 mb-2">This level allows holders to:</p>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Full platform-level privileges</li>
            <li>Manage heritage content releases</li>
            <li>Approve curated submissions</li>
            <li>Access private archive vaults</li>
            <li>Organize official events</li>
            <li>Direct coordination with project leadership</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            Admin-level NFTs are extremely rare and represent top-tier authority within the heritage ecosystem.
          </p>
          <p className="text-xs text-lightbrown italic">Best for: Core team members or elite-tier holders.</p>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Resource Unlock Score */}
      <div className="border-b border-lightbrown">
        <button
          type="button"
          onClick={() => toggle('resourceScore')}
          className="w-full py-4 flex items-center justify-between gap-4 text-left hover:opacity-90 transition-opacity"
          aria-expanded={openSection === 'resourceScore'}
        >
          <h3 className="text-2xl font-bold tracking-tight text-blackbrown">Resource Unlock Score (0–10)</h3>
          <FiChevronDown
            className={`shrink-0 w-6 h-6 text-[#693422] transition-transform duration-200 ${openSection === 'resourceScore' ? 'rotate-180' : ''}`}
            aria-hidden
          />
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-out"
          style={{ gridTemplateRows: openSection === 'resourceScore' ? '1fr' : '0fr' }}
        >
          <div className="overflow-hidden min-h-0">
            <div className="pb-6 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
              <p className="text-sm sm:text-base text-blackbrown/80 max-w-xl">
                The Resource Unlock Score represents how much digital and cultural content your NFT can unlock. Think of it as your NFT&apos;s heritage access power level. The higher the score, the more exclusive resources you can access.
              </p>
              <p className="text-xs sm:text-sm uppercase tracking-wide text-lightbrown text-right">
                Resource Unlock Score determines how many digital and cultural resources your NFT can access. Higher scores unlock more exclusive content and benefits.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm sm:text-base">
        {/* Score 0–1 */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiMinus className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 0–1 → Minimal Access</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Basic public content</li>
            <li>Standard NFT gallery viewing</li>
            <li>Limited announcements</li>
            <li>No premium unlocks</li>
          </ul>
          <p className="text-xs text-lightbrown italic">Best for: Entry-level collectors.</p>
        </div>

        {/* Score 2–3 */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiUnlock className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 2–3 → Limited Unlock</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Access to selected members-only content</li>
            <li>Unlock basic digital resources</li>
            <li>Small discount eligibility</li>
            <li>Early public event notifications</li>
          </ul>
          <p className="text-xs text-lightbrown italic">Best for: Casual community participants.</p>
        </div>

        {/* Score 4–5 */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiBookOpen className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 4–5 → Moderate Unlock</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Access to educational materials</li>
            <li>Selected expert talk recordings</li>
            <li>Unlock selected rare digital artwork</li>
            <li>Medium-level event priority</li>
            <li>Special badge on profile</li>
          </ul>
          <p className="text-xs text-lightbrown italic">Best for: Active heritage supporters.</p>
        </div>

        {/* Score 6–7 */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiArchive className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 6–7 → Advanced Unlock</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Access to premium archive content</li>
            <li>Private webinar invitations</li>
            <li>Expanded research materials</li>
            <li>Higher discount benefits</li>
            <li>Early access to upcoming NFT drops</li>
          </ul>
          <p className="text-xs text-lightbrown italic">Best for: Serious collectors and researchers.</p>
        </div>

        {/* Score 8–9 */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiAward className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 8–9 → Elite Unlock</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Full digital archive access</li>
            <li>Exclusive heritage documentation</li>
            <li>VIP event invitations</li>
            <li>Priority support access</li>
            <li>Limited-edition content unlock</li>
          </ul>
          <p className="text-xs text-lightbrown italic">Best for: High-value NFT holders.</p>
        </div>

        {/* Score 10 – same row as 6–7 and 8–9 on lg */}
        <div className="flex flex-col bg-[#F6E7CA]/25 border border-lightbrown p-4 sm:p-5 shadow-sm transition-transform transition-shadow duration-200 hover:-translate-y-1 hover:shadow-md">
          <div className="mb-3 h-10 w-10 rounded-full bg-[#F6E7CA]/80 border border-lightbrown flex items-center justify-center">
            <FiStar className="text-[#693422]" />
          </div>
          <h4 className="font-semibold text-[#693422] mb-1">Score 10 → Ultimate Heritage Access</h4>
          <ul className="list-disc list-inside space-y-1 text-blackbrown/80 mb-2">
            <li>Unlock all digital resources</li>
            <li>Private content vault access</li>
            <li>Direct access to premium expert sessions</li>
            <li>Maximum discounts</li>
            <li>Highest rarity recognition badge</li>
          </ul>
          <p className="text-blackbrown/80 text-sm mb-1">
            Score 10 NFTs are extremely rare and carry maximum utility.
          </p>
        </div>
      </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  )
}
