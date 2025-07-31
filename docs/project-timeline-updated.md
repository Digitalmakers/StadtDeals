# Updated Project Timeline - StadtDeals

## Overview

Following the PO validation and risk assessment, the project timeline has been adjusted to address critical issues and reduce implementation risks.

## Key Changes

1. **Epic 0 Extended**: From 2 weeks to 2.5 weeks (added Firebase setup and design system)
2. **Epic 4 Split**: Divided into Epic 4A (Cart/Checkout) and Epic 4B (Chat/Notifications)
3. **Total Duration**: Increased from 26 to 27 weeks development time
4. **Buffer Maintained**: 4 weeks buffer remains for total 31 weeks

## Updated Sprint Plan

```
Timeline: 31 weeks total (27 development + 4 buffer)

Epic 0: Project Init     ██████████ (2.5 weeks) - Week 1-2.5
Epic 1: Auth & Basic     ████████████ (3 weeks) - Week 3-5.5
Epic 2: Vendor Onboard   ████████████████████████ (6 weeks) - Week 6-11.5
Epic 3: Product Catalog  ████████████████████ (5 weeks) - Week 12-16.5
Epic 4A: Cart/Checkout   ████████████████ (4 weeks) - Week 17-20.5
Epic 4B: Chat/Notif      ████████████ (3 weeks) - Week 21-23.5
Epic 5: QA & Launch      ████████████ (3 weeks) - Week 24-26.5
Epic 6: Buffer           ████████████████ (4 weeks) - Week 27.5-31
```

## Detailed Timeline

### Phase 1: Foundation (Weeks 1-5.5)
**Epic 0: Project Foundation & Setup** (2.5 weeks)
- Week 1: Firebase setup, dev environment, design system start
- Week 2: React Native project, core dependencies, design system completion
- Week 2.5: Firebase integration, testing setup

**Epic 1: Authentication & Basic Services** (3 weeks)
- Week 3: Firebase Auth, OTP implementation
- Week 4: Role management, customer profiles
- Week 5: UI framework, navigation, magic links

### Phase 2: Core Features (Weeks 6-16.5)
**Epic 2: Vendor Onboarding** (6 weeks)
- Week 6-7: Web registration interface
- Week 8-9: Document verification, admin approval
- Week 10-11: Stripe Connect, Google Places integration

**Epic 3: Product Catalog & Vouchers** (5 weeks)
- Week 12-13: Product CRUD, image handling
- Week 14-15: Search, filters, categories
- Week 16: Voucher system, Google Reviews

### Phase 3: Transaction & Communication (Weeks 17-23.5)
**Epic 4A: Shopping Cart & Checkout** (4 weeks)
- Week 17: Single-vendor cart
- Week 18: Multi-vendor logic
- Week 19: Stripe payment integration
- Week 20: Order management

**Epic 4B: Communication & Notifications** (3 weeks)
- Week 21: Chat infrastructure
- Week 22: Push notifications
- Week 23: Email service, system messages

### Phase 4: Launch Preparation (Weeks 24-31)
**Epic 5: QA & Launch** (3 weeks)
- Week 24: Integration testing
- Week 25: Performance optimization
- Week 26: App store preparation

**Epic 6: Buffer & Hypercare** (4 weeks)
- Week 27-28: App store review process
- Week 29-30: Bug fixes and stabilization
- Week 31: Go-live and monitoring

## Resource Allocation

### Parallel Work Opportunities

**During Epic 0:**
- Design system can start after Firebase setup (Day 2)
- Documentation can begin immediately

**During Epic 2:**
- Start Epic 3 UI design (Week 8)
- Begin Stripe Connect application (Week 6)

**During Epic 4A:**
- Frontend team on cart UI (Week 17)
- Backend team on payment integration (Week 17)

**During Epic 4B:**
- One developer on chat (Week 21)
- Another on notifications (Week 21)

## Critical Path

```
Firebase Setup (0.0) → Auth System (1.1) → Vendor Registration (2.x) → 
Product Creation (3.x) → Shopping Cart (4A.x) → Payment Processing (4A.4) → 
Order Management (4A.5) → QA & Launch (5.x)
```

## Risk Mitigation Timeline

### Week 1: Foundation Risks
- ✓ Firebase project creation (Day 1-2)
- ✓ Design system kickoff (Day 3)
- ✓ Team environment setup

### Week 6: Integration Risks
- ✓ Stripe Connect application started
- ✓ Google Places API quota monitoring

### Week 17: Complexity Risks
- ✓ Simple cart first, then multi-vendor
- ✓ Payment in test mode initially

### Week 24: Launch Risks
- ✓ TestFlight submission early
- ✓ Performance testing throughout

## Budget Impact

**Original Budget**: €66,000 (30 weeks)
**Updated Budget**: €68,200 (31 weeks)
**Increase**: €2,200 (3.3%)

**Justification**:
- Reduced risk of critical failures
- Better quality foundation
- Clearer separation of complex features
- Higher success probability

## Success Metrics

### Sprint Velocity Targets
- Epic 0: 80% story completion (learning curve)
- Epic 1-3: 90% story completion
- Epic 4A/B: 85% story completion (complexity)
- Epic 5: 95% completion

### Quality Gates
- End of Epic 0: All developers productive
- End of Epic 1: Authentication working E2E
- End of Epic 2: First vendor onboarded
- End of Epic 3: Products visible in app
- End of Epic 4A: First purchase completed
- End of Epic 4B: Messages sending successfully
- End of Epic 5: App store ready

## Conclusion

The updated timeline addresses all critical issues identified in the PO validation:
1. Firebase setup now happens first
2. Design system established early
3. Epic 4 complexity reduced through split
4. Risk monitoring built into process
5. Slightly extended timeline improves success probability

The 1-week extension (3.3% increase) significantly reduces project risk while maintaining aggressive delivery targets.