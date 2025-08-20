# frozen_string_literal: true

require 'async'

module Ambler
  def self.amble(state, lead)
    current_state = state
    current_lead = lead

    Async do
      current_state, current_lead = yield(current_lead, current_state) while current_lead
    end

    current_state
  end
end
