# frozen_string_literal: true

module Ambler
  def self.amble(state, lead, follow)
    current_state = state
    current_lead = lead

    while current_lead
      current_state, current_lead = follow.call(current_state, current_lead)
    end

    current_state
  end
end
